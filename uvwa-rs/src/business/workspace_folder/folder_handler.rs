use crate::business::workspace_folder::folder_dao::{Folder, FolderDao};
use crate::core::code::Code;
use crate::models::context::Context;
use crate::models::workspace_folder::{
    CreateFolderReq, FolderResp, MoveFolderReq, UpdateFolderReq,
};
use crate::r;
use crate::web::error::WebError;
use crate::web::extract::Json;
use crate::web::r::R;
use axum::extract::Path;
use std::collections::HashMap;
use validator::Validate;

// 查询目录树
pub async fn get_folder_tree(ctx: Context, Path(folder_type): Path<i32>) -> R<Vec<FolderResp>> {
    let tenant_id = ctx.tenant_id;
    let workspace_id = ctx.workspace_id;

    let folders = r!(FolderDao::list(tenant_id, workspace_id, folder_type).await);

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

// 创建目录
pub async fn create_folder(
    ctx: Context,
    Path(folder_type): Path<i32>,
    Json(req): Json<CreateFolderReq>,
) -> R<String> {
    r!(req.validate());
    let tenant_id = ctx.tenant_id;
    let workspace_id = ctx.workspace_id;

    // Check parent
    r!(validate_parent_exists(tenant_id, workspace_id, req.parent_id).await);

    let max_seq = r!(FolderDao::get_max_seq(tenant_id, workspace_id, req.parent_id).await);
    let seq = max_seq.unwrap_or(0) + 1;

    let mut folder = Folder::new(tenant_id, workspace_id, folder_type);
    folder.parent_id = req.parent_id;
    folder.name = req.name;
    folder.seq = seq;

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

    let mut folder = r!(validate_folder_exists(tenant_id, workspace_id, id).await);

    folder.name = req.name;
    r!(FolderDao::update(&folder).await);
    R::void()
}

// 删除文件夹
pub async fn delete_folder(ctx: Context, Path((_folder_type, id)): Path<(i32, u64)>) -> R<()> {
    let tenant_id = ctx.tenant_id;
    let workspace_id = ctx.workspace_id;

    let folder = r!(validate_folder_exists(tenant_id, workspace_id, id).await);

    // Check children
    let count = r!(FolderDao::count_children(tenant_id, workspace_id, id).await);
    if count > 0 {
        return R::err(WebError::BizWithArgs(Code::FolderNotEmpty.into(), vec![]));
    }

    r!(FolderDao::delete(tenant_id, workspace_id, id).await);
    r!(FolderDao::compress_seq(tenant_id, workspace_id, folder.parent_id, folder.seq).await);
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

    let folder = r!(validate_folder_exists(tenant_id, workspace_id, id).await);
    r!(validate_parent_exists(tenant_id, workspace_id, req.parent_id).await);

    r!(FolderDao::compress_seq(tenant_id, workspace_id, folder.parent_id, folder.seq).await);
    r!(FolderDao::shift_seq(tenant_id, workspace_id, req.parent_id, req.seq).await);
    r!(FolderDao::update_parent_and_seq(tenant_id, workspace_id, id, req.parent_id, req.seq).await);
    R::void()
}

// 校验文件夹是否存在
async fn validate_folder_exists(
    tenant_id: u64,
    workspace_id: u64,
    id: u64,
) -> Result<Folder, WebError> {
    FolderDao::get_by_id(tenant_id, workspace_id, id)
        .await?
        .ok_or_else(|| WebError::Biz(Code::FolderNotExist.into()))
}

// 校验父目录是否存在
async fn validate_parent_exists(
    tenant_id: u64,
    workspace_id: u64,
    parent_id: u64,
) -> Result<(), WebError> {
    if parent_id == 0 {
        return Ok(());
    }

    let parent = FolderDao::get_by_id(tenant_id, workspace_id, parent_id).await?;
    if parent.is_none() {
        return Err(WebError::Biz(Code::FolderParentNotExist.into()));
    }
    Ok(())
}
