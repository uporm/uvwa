use crate::business::app::app_dao::{App, AppContent, AppDao, AppRelease, AppReleaseContent};
use crate::business::folder::folder_dao::FolderDao;
use crate::models::app::{
    AppCloneReq, AppContentUpdateReq, AppCreateReq, AppQuery, AppReleaseReq, AppTagUpdateReq,
    AppUpdateReq, AppVO,
};
use crate::models::context::Context;
use crate::r;
use crate::utils::id::Id;
use crate::web::code::Code;
use crate::web::error::WebError;
use crate::web::extract::Json;
use crate::web::r::R;
use axum::extract::{Path, Query};

// 查询应用列表
pub async fn list_apps(ctx: Context, Query(query): Query<AppQuery>) -> R<Vec<AppVO>> {
    let apps = r!(AppDao::list(ctx.tenant_id, ctx.workspace_id, &query).await);

    let tag_filter = query.tag_ids.as_ref();

    let apps_vo = apps
        .into_iter()
        .filter(|app| {
            if let Some(filter_tags) = tag_filter {
                if filter_tags.is_empty() {
                    return true;
                }
                if let Some(tags_str) = &app.tag_ids_str {
                    let app_tags: Vec<u64> =
                        tags_str.split(',').filter_map(|s| s.parse().ok()).collect();
                    return app_tags.iter().any(|id| filter_tags.contains(id));
                }
                return false;
            }
            true
        })
        .map(|app| {
            let tag_ids = app
                .tag_ids_str
                .as_ref()
                .map(|s| s.split(',').filter_map(|x| x.parse::<u64>().ok()).collect());
            AppVO {
                id: app.id,
                folder_id: app.folder_id,
                r#type: app._type,
                name: app.name,
                description: app.description,
                tag_ids,
            }
        })
        .collect::<Vec<AppVO>>();

    R::ok(apps_vo)
}

pub async fn get_app_content(ctx: Context, Path(id): Path<u64>) -> R<Option<String>> {
    let content = r!(AppDao::get_content(ctx.tenant_id, ctx.workspace_id, id).await);
    R::ok(content.map(|c| c.content))
}

pub async fn create_app(ctx: Context, Json(req): Json<AppCreateReq>) -> R<()> {
    let folder_id = req.folder_id; // Potential truncation!

    let folder = r!(FolderDao::get_by_id(ctx.tenant_id, ctx.workspace_id, folder_id).await);
    if folder.is_none() {
        return R::err(WebError::BizWithArgs(
            Code::AppParentFolderNotExist.into(),
            vec![],
        ));
    }

    let app = App {
        id: Id::next_id().unwrap(),
        tenant_id: ctx.tenant_id,
        workspace_id: ctx.workspace_id,
        folder_id: req.folder_id,
        _type: req.r#type,
        name: req.name,
        description: req.description,
        tag_ids_str: None,
    };
    r!(AppDao::insert(&app).await);
    R::void()
}

pub async fn update_app(ctx: Context, Path(id): Path<u64>, Json(req): Json<AppUpdateReq>) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    // We need to update existing app object or create a new one with updated fields.
    // Since AppDao::update uses the struct to set fields, and SQL uses #{name}, #{description}.
    // We can create a partial App struct or just populate necessary fields.
    // The App struct has all fields. We should ideally reuse the existing one but update fields.
    // But get_by_id returns App.
    let mut app = exist.unwrap();
    app.name = req.name;
    app.description = req.description;

    r!(AppDao::update(&app).await);
    R::void()
}

pub async fn delete_app(ctx: Context, Path(id): Path<u64>) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    r!(AppDao::delete(ctx.tenant_id, ctx.workspace_id, id).await);
    r!(AppDao::delete_content(ctx.tenant_id, ctx.workspace_id, id).await);
    r!(AppDao::delete_releases(ctx.tenant_id, ctx.workspace_id, id).await);
    r!(AppDao::delete_release_content(ctx.tenant_id, ctx.workspace_id, id).await);

    R::void()
}

pub async fn update_app_content(
    ctx: Context,
    Path(id): Path<u64>,
    Json(req): Json<AppContentUpdateReq>,
) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    let content = AppContent {
        id: Id::next_id().unwrap(), // ID is used for insert, but insertOrUpdate might use it if inserting.
        tenant_id: ctx.tenant_id,
        workspace_id: ctx.workspace_id,
        app_id: id,
        content: req.content,
    };
    r!(AppDao::insert_or_update_content(&content).await);
    R::void()
}

pub async fn update_app_tags(
    ctx: Context,
    Path(id): Path<u64>,
    Json(req): Json<AppTagUpdateReq>,
) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    r!(AppDao::delete_app_tag(ctx.tenant_id, ctx.workspace_id, id).await);
    if let Some(tag_ids) = req.tag_ids {
        if !tag_ids.is_empty() {
            r!(AppDao::batch_insert_app_tags(ctx.tenant_id, ctx.workspace_id, id, &tag_ids).await);
        }
    }
    R::void()
}

pub async fn clone_app(ctx: Context, Path(id): Path<u64>, Json(req): Json<AppCloneReq>) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }
    let original_app = exist.unwrap();

    let content = r!(AppDao::get_content(ctx.tenant_id, ctx.workspace_id, id).await);

    let new_app_id = Id::next_id().unwrap();
    let new_app = App {
        id: new_app_id,
        tenant_id: ctx.tenant_id,
        workspace_id: ctx.workspace_id,
        folder_id: original_app.folder_id,
        _type: original_app._type,
        name: req.name,
        description: req.description,
        tag_ids_str: None,
    };
    r!(AppDao::insert(&new_app).await);

    if let Some(c) = content {
        let new_content = AppContent {
            id: Id::next_id().unwrap(),
            tenant_id: ctx.tenant_id,
            workspace_id: ctx.workspace_id,
            app_id: new_app_id,
            content: c.content,
        };
        r!(AppDao::insert_or_update_content(&new_content).await);
    }

    R::void()
}

pub async fn release_app(
    ctx: Context,
    Path(id): Path<u64>,
    Json(req): Json<AppReleaseReq>,
) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    let content = r!(AppDao::get_content(ctx.tenant_id, ctx.workspace_id, id).await);
    if content.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppContentNotExist.into(), vec![]));
    }
    let content_str = content.unwrap().content;

    r!(AppDao::cancel_latest(ctx.tenant_id, ctx.workspace_id, id).await);

    let (major, minor, patch, pre) = parse_version(&req.version);

    let release_id = Id::next_id().unwrap();
    let release = AppRelease {
        id: release_id,
        tenant_id: ctx.tenant_id,
        workspace_id: ctx.workspace_id,
        app_id: id,
        version: req.version,
        major,
        minor,
        patch,
        pre_release: pre,
        description: req.description,
        is_latest: true,
    };
    r!(AppDao::insert_release(&release).await);

    let release_content = AppReleaseContent {
        id: Id::next_id().unwrap(),
        tenant_id: ctx.tenant_id,
        workspace_id: ctx.workspace_id,
        app_release_id: release_id,
        content: content_str,
    };
    r!(AppDao::insert_release_content(&release_content).await);

    R::void()
}

fn parse_version(version: &str) -> (Option<i32>, Option<i32>, Option<i32>, Option<String>) {
    let (main, pre) = match version.find('-') {
        Some(idx) => (&version[..idx], Some(version[idx + 1..].to_string())),
        None => (version, None),
    };
    let parts: Vec<&str> = main.split('.').collect();
    let major = parts.get(0).and_then(|s| s.parse().ok());
    let minor = parts.get(1).and_then(|s| s.parse().ok());
    let patch = parts.get(2).and_then(|s| s.parse().ok());
    (major, minor, patch, pre)
}
