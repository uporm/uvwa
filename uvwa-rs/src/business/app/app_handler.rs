use crate::business::app::app_dao::{App, AppDao, AppDraft, AppVersion, AppVersionSpec};
use crate::business::workspace_folder::folder_dao::FolderDao;
use crate::models::app::{
    AppCloneReq, AppCreateReq, AppDraftUpdateReq, AppReq, AppResp, AppTagUpdateReq, AppUpdateReq,
    AppVersionReq,
};
use crate::models::context::Context;
use crate::r;
use crate::utils::id::Id;
use crate::web::code::Code;
use crate::web::error::WebError;
use crate::web::extract::Json;
use crate::web::r::R;
use axum::extract::{Path, Query};
use std::collections::HashMap;
use uorm::transaction;
use validator::Validate;

// 查询应用列表
pub async fn list_apps(ctx: Context, Query(req): Query<AppReq>) -> R<Vec<AppResp>> {
    let apps = r!(AppDao::list(ctx.tenant_id, ctx.workspace_id, &req).await);
    if apps.is_empty() {
        return R::ok(vec![]);
    }

    let app_ids = apps.iter().map(|a| a.id).collect::<Vec<u64>>();
    let app_tags =
        r!(AppDao::list_app_tags_by_app_ids(ctx.tenant_id, ctx.workspace_id, &app_ids).await);

    let mut tag_ids_by_app_id: HashMap<u64, Vec<u64>> = HashMap::new();
    for t in app_tags {
        tag_ids_by_app_id
            .entry(t.app_id)
            .or_default()
            .push(t.tag_id);
    }
    for tag_ids in tag_ids_by_app_id.values_mut() {
        tag_ids.sort_unstable();
        tag_ids.dedup();
    }

    let tag_filter = req.tag_ids.as_ref().filter(|ids| !ids.is_empty());
    let apps_vo = apps
        .into_iter()
        .filter(|app| match tag_filter {
            None => true,
            Some(filter_tags) => tag_ids_by_app_id.get(&app.id).map_or(false, |app_tags| {
                app_tags.iter().any(|id| filter_tags.contains(id))
            }),
        })
        .map(|app| AppResp {
            id: app.id,
            folder_id: app.folder_id,
            app_type: app.app_type,
            name: app.name,
            description: app.description,
            tag_ids: tag_ids_by_app_id.get(&app.id).cloned().unwrap_or_default(),
        })
        .collect::<Vec<AppResp>>();

    R::ok(apps_vo)
}

pub async fn get_app_draft(ctx: Context, Path(id): Path<u64>) -> R<Option<String>> {
    let draft = r!(AppDao::get_draft(ctx.tenant_id, ctx.workspace_id, id).await);
    R::ok(draft.map(|c| c.spec))
}

pub async fn create_app(ctx: Context, Json(req): Json<AppCreateReq>) -> R<()> {
    r!(req.validate());
    let folder_id = req.folder_id;

    if req.folder_id != 0 {
        let folder = r!(FolderDao::get_by_id(ctx.tenant_id, ctx.workspace_id, folder_id).await);
        if folder.is_none() {
            return R::err(WebError::BizWithArgs(
                Code::AppParentFolderNotExist.into(),
                vec![],
            ));
        }
    }

    let mut app: App = req.into();
    app.tenant_id(ctx.tenant_id).workspace_id(ctx.workspace_id);
    r!(AppDao::insert(&app).await);
    R::void()
}

pub async fn update_app(ctx: Context, Path(id): Path<u64>, Json(req): Json<AppUpdateReq>) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    let mut app = exist.unwrap();
    app.name = req.name;
    app.description = req.description;

    r!(AppDao::update(&app).await);
    R::void()
}

#[transaction]
pub async fn delete_app(ctx: Context, Path(id): Path<u64>) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    r!(AppDao::delete(ctx.tenant_id, ctx.workspace_id, id).await);
    r!(AppDao::delete_draft(ctx.tenant_id, ctx.workspace_id, id).await);
    r!(AppDao::delete_versions(ctx.tenant_id, ctx.workspace_id, id).await);
    r!(AppDao::delete_version_spec(ctx.tenant_id, ctx.workspace_id, id).await);

    R::void()
}

pub async fn update_app_draft(
    ctx: Context,
    Path(id): Path<u64>,
    Json(req): Json<AppDraftUpdateReq>,
) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    let content = AppDraft {
        id: Id::next_id().unwrap(), // ID is used for insert, but insertOrUpdate might use it if inserting.
        tenant_id: ctx.tenant_id,
        workspace_id: ctx.workspace_id,
        app_id: id,
        spec: req.spec,
    };
    r!(AppDao::insert_or_update_draft(&content).await);
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
    if !req.tag_ids.is_empty() {
        r!(AppDao::batch_insert_app_tags(ctx.tenant_id, ctx.workspace_id, id, &req.tag_ids).await);
    }
    R::void()
}

pub async fn clone_app(ctx: Context, Path(id): Path<u64>, Json(req): Json<AppCloneReq>) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }
    let original_app = exist.unwrap();

    let content = r!(AppDao::get_draft(ctx.tenant_id, ctx.workspace_id, id).await);

    let new_app_id = Id::next_id().unwrap();
    let new_app = App {
        id: new_app_id,
        tenant_id: ctx.tenant_id,
        workspace_id: ctx.workspace_id,
        folder_id: original_app.folder_id,
        app_type: original_app.app_type,
        name: req.name,
        description: req.description,
    };
    r!(AppDao::insert(&new_app).await);

    if let Some(c) = content {
        let new_content = AppDraft {
            id: Id::next_id().unwrap(),
            tenant_id: ctx.tenant_id,
            workspace_id: ctx.workspace_id,
            app_id: new_app_id,
            spec: c.spec,
        };
        r!(AppDao::insert_or_update_draft(&new_content).await);
    }

    R::void()
}

pub async fn release_app(
    ctx: Context,
    Path(id): Path<u64>,
    Json(req): Json<AppVersionReq>,
) -> R<()> {
    let exist = r!(AppDao::get_by_id(ctx.tenant_id, ctx.workspace_id, id).await);
    if exist.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppNotExist.into(), vec![]));
    }

    let content = r!(AppDao::get_draft(ctx.tenant_id, ctx.workspace_id, id).await);
    if content.is_none() {
        return R::err(WebError::BizWithArgs(Code::AppDraftNotExist.into(), vec![]));
    }
    let content_str = content.unwrap().spec;

    r!(AppDao::cancel_latest(ctx.tenant_id, ctx.workspace_id, id).await);

    let (major, minor, patch, pre) = parse_version(&req.version);

    let release_id = Id::next_id().unwrap();
    let version = AppVersion {
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
    r!(AppDao::insert_version(&version).await);

    let version_spec = AppVersionSpec {
        id: Id::next_id().unwrap(),
        tenant_id: ctx.tenant_id,
        workspace_id: ctx.workspace_id,
        app_release_id: release_id,
        spec: content_str,
    };
    r!(AppDao::insert_version_spec(&version_spec).await);

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
