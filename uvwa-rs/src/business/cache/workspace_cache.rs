use crate::business::workspace::workspace_dao::{Workspace, WorkspaceDao};
use moka::future::Cache;
use std::sync::LazyLock;
use std::time::Duration;

// 工作空间缓存： user_id -> workspace_id
pub static WORKSPACE_CACHE: LazyLock<Cache<u64, u64>> = LazyLock::new(|| {
    Cache::builder()
        .max_capacity(100_000)
        .time_to_live(Duration::from_secs(24_60_60))
        .build()
});

pub async fn get_workspace_id(tenant_id: u64, user_id: u64) -> u64 {
    WORKSPACE_CACHE
        .get_with(user_id, async move {
            let workspace_id = get_default_workspace(tenant_id).await;
            workspace_id.unwrap_or_default()
        })
        .await
}

pub async fn switch_workspace(user_id: u64, workspace_id: u64) {
    WORKSPACE_CACHE.insert(user_id, workspace_id).await;
}

async fn get_default_workspace(tenant_id: u64) -> uorm::Result<u64> {
    let workspaces = WorkspaceDao::list(tenant_id).await?;
    let workspace_id = if workspaces.is_empty() {
        let workspace = Workspace::new(tenant_id)
            .name("默认工作空间".into())
            .description(None);
        WorkspaceDao::insert(&workspace).await?;
        workspace.id
    } else {
        workspaces[0].id
    };
    Ok(workspace_id)
}
