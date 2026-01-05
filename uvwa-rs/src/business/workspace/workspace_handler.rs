use crate::business::cache::workspace_cache;
use crate::business::workspace::workspace_consumer::WorkspaceConsumer;
use crate::business::workspace::workspace_dao::{Workspace, WorkspaceDao};
use crate::models::context::Context;
use crate::models::workspace::{WorkspaceReq, WorkspaceResp};
use crate::r;
use crate::web::code::Code;
use crate::web::error::WebError;
use crate::web::extract::Json;
use crate::web::r::R;
use axum::extract::Path;
use uorm::transaction;

// 查询工作空间列表
pub async fn list_workspaces(ctx: Context) -> R<Vec<WorkspaceResp>> {
    let workspaces = r!(WorkspaceDao::list(ctx.tenant_id).await);
    let mut workspaces = workspaces
        .into_iter()
        .map(|workspace| workspace.into())
        .collect::<Vec<WorkspaceResp>>();

    let cached_id = workspace_cache::get_workspace_id(ctx.tenant_id, ctx.user_id).await;

    if let Some(id) = cached_id {
        for workspace in &mut workspaces {
            if workspace.id == id {
                workspace.selected = true;
                break;
            }
        }
    } else if let Some(first) = workspaces.first_mut() {
        first.selected = true;
        workspace_cache::switch_workspace(ctx.user_id, first.id).await;
    }

    R::ok(workspaces)
}

// 创建工作空间
#[transaction]
pub async fn create_workspace(ctx: Context, Json(req): Json<WorkspaceReq>) -> R<()> {
    let workspace = Workspace::new(ctx.tenant_id)
        .name(req.name)
        .description(req.description);
    r!(WorkspaceDao::insert(&workspace).await);
    r!(WorkspaceConsumer::start_dispatching(ctx.tenant_id,workspace.id).await);
    R::void()
}

// 更新工作空间
pub async fn update_workspace(
    ctx: Context,
    Path(id): Path<u64>,
    Json(req): Json<WorkspaceReq>,
) -> R<()> {
    let workspace = Workspace::from(ctx.tenant_id, id)
        .name(req.name)
        .description(req.description);
    r!(WorkspaceDao::update(workspace).await);
    R::void()
}

// 删除工作空间
pub async fn delete_workspace(ctx: Context, Path(id): Path<u64>) -> R<()> {
    if ctx.workspace_id == id {
        return R::err(WebError::Biz(Code::WorkspaceCurrentCannotDelete.into()));
    }
    r!(WorkspaceDao::delete(ctx.tenant_id, id).await);
    R::void()
}

// 切换工作空间
pub async fn switch_workspace(ctx: Context, Path(id): Path<u64>) -> R<()> {
    workspace_cache::switch_workspace(ctx.user_id, id).await;
    R::void()
}
