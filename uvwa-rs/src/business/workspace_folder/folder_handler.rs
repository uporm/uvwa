use crate::business::workspace_folder::folder_dao::{Folder, FolderDao};
use crate::models::context::Context;
use crate::models::workspace_folder::{
    CreateFolderReq, FolderResp, MoveFolderReq, UpdateFolderReq,
};
use crate::r;
use crate::web::code::Code;
use crate::web::error::WebError;
use crate::web::extract::Json;
use crate::web::r::R;
use axum::extract::Path;
use std::collections::HashMap;
use validator::Validate;

// 查询文件夹树
pub async fn get_folder_tree(ctx: Context, Path(folder_type): Path<i32>) -> R<Vec<FolderResp>> {
    let tenant_id = ctx.tenant_id;
    let workspace_id = ctx.workspace_id;

    let mut folders = r!(FolderDao::list(tenant_id, workspace_id, folder_type).await);

    // If no folders, create default one
    if folders.is_empty() {
        let folder = Folder::new(tenant_id, workspace_id, folder_type);
        r!(FolderDao::insert(&folder).await);
        folders = r!(FolderDao::list(tenant_id, workspace_id, folder_type).await);
    }

    let folder_resps: Vec<FolderResp> = folders.into_iter().map(|f| f.into()).collect();
    let tree = build_folder_tree(folder_resps);
    R::ok(tree)
}

fn build_folder_tree(folders: Vec<FolderResp>) -> Vec<FolderResp> {
    let mut map_by_parent: HashMap<u64, Vec<FolderResp>> = HashMap::with_capacity(folders.len());
    for f in folders {
        map_by_parent.entry(f.parent_id).or_default().push(f);
    }

    build_recursive(0, &mut map_by_parent)
}

fn build_recursive(parent_id: u64, map: &mut HashMap<u64, Vec<FolderResp>>) -> Vec<FolderResp> {
    let mut children = map.remove(&parent_id).unwrap_or_default();

    // Sort children by seq, then by name for consistent ordering
    children.sort_by(|a, b| a.seq.cmp(&b.seq).then_with(|| a.name.cmp(&b.name)));

    for child in &mut children {
        child.children = build_recursive(child.id, map);
    }
    children
}

// 创建文件夹
pub async fn create_folder(
    ctx: Context,
    Path(folder_type): Path<i32>,
    Json(req): Json<CreateFolderReq>,
) -> R<String> {
    r!(req.validate());
    let tenant_id = ctx.tenant_id;
    let workspace_id = ctx.workspace_id;

    // Check parent
    if req.parent_id != 0 {
        let parent = r!(FolderDao::get_by_id(tenant_id, workspace_id, req.parent_id).await);
        if parent.is_none() {
            return R::err(WebError::BizWithArgs(
                Code::FolderParentNotExist.into(),
                vec![],
            ));
        }
    }

    let max_seq = r!(FolderDao::get_max_seq(tenant_id, workspace_id, req.parent_id).await);
    let seq = max_seq.unwrap_or(0) + 1;

    let mut folder = Folder::new(tenant_id, workspace_id, folder_type);
    folder
        .parent_id(req.parent_id)
        .name(req.name)
        .seq(seq)
        .description(req.description);

    let id = r!(FolderDao::insert(&folder).await);
    R::ok(id.to_string())
}

// 更新文件夹
pub async fn update_folder(
    ctx: Context,
    Path((_folder_type, id)): Path<(i32, u64)>,
    Json(req): Json<UpdateFolderReq>,
) -> R<()> {
    r!(req.validate());
    let tenant_id = ctx.tenant_id;
    let workspace_id = ctx.workspace_id;

    let Some(mut folder) = r!(FolderDao::get_by_id(tenant_id, workspace_id, id).await) else {
        return R::err(WebError::BizWithArgs(Code::FolderNotExist.into(), vec![]));
    };

    folder.name = req.name;
    folder.description = req.description;
    r!(FolderDao::update(&folder).await);
    R::void()
}

// 删除文件夹
pub async fn delete_folder(ctx: Context, Path((_folder_type, id)): Path<(i32, u64)>) -> R<()> {
    let tenant_id = ctx.tenant_id;
    let workspace_id = ctx.workspace_id;

    let Some(folder) = r!(FolderDao::get_by_id(tenant_id, workspace_id, id).await) else {
        return R::err(WebError::BizWithArgs(Code::FolderNotExist.into(), vec![]));
    };

    // Check children
    let count = r!(FolderDao::count_children(tenant_id, workspace_id, id).await);
    if count > 0 {
        return R::err(WebError::BizWithArgs(Code::FolderNotEmpty.into(), vec![]));
    }

    r!(FolderDao::delete(tenant_id, workspace_id, id).await);
    r!(
        FolderDao::compress_seq_on_remove(tenant_id, workspace_id, folder.parent_id, folder.seq)
            .await
    );
    R::void()
}

// 移动文件夹
pub async fn move_folder(
    ctx: Context,
    Path((_folder_type, id)): Path<(i32, u64)>,
    Json(req): Json<MoveFolderReq>,
) -> R<()> {
    r!(req.validate());
    let tenant_id = ctx.tenant_id;
    let workspace_id = ctx.workspace_id;

    if id == req.parent_id {
        return R::err(WebError::BizWithArgs(Code::FolderMoveToSelf.into(), vec![]));
    }

    let Some(folder) = r!(FolderDao::get_by_id(tenant_id, workspace_id, id).await) else {
        return R::err(WebError::BizWithArgs(Code::FolderNotExist.into(), vec![]));
    };

    if req.parent_id != 0 {
        let parent = r!(FolderDao::get_by_id(tenant_id, workspace_id, req.parent_id).await);
        if parent.is_none() {
            return R::err(WebError::BizWithArgs(
                Code::FolderParentNotExist.into(),
                vec![],
            ));
        }
    }

    r!(
        FolderDao::compress_seq_on_remove(tenant_id, workspace_id, folder.parent_id, folder.seq)
            .await
    );
    r!(FolderDao::shift_seq_on_insert(tenant_id, workspace_id, req.parent_id, req.seq).await);
    r!(FolderDao::update_parent_and_seq(tenant_id, workspace_id, id, req.parent_id, req.seq).await);
    R::void()
}
