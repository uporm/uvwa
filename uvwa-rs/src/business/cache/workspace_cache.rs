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

use tracing::{error, info, instrument};

pub async fn get_workspace_id(tenant_id: u64, user_id: u64) -> u64 {
    // 检查是否重入，防止死循环/栈溢出

    // 1. 尝试从缓存读取
    if let Some(workspace_id) = WORKSPACE_CACHE.get(&user_id).await {
        return workspace_id;
    }

    info!(
        "Cache miss for user_id: {}, fetching default workspace",
        user_id
    );

    // 2. 缓存未命中，查询数据库
    let workspace_id = get_default_workspace(tenant_id).await.unwrap_or_default();

    // 3. 只有获取到有效 ID 才写入缓存
    if workspace_id != 0 {
        WORKSPACE_CACHE.insert(user_id, workspace_id).await;
    }
    workspace_id
}

pub async fn switch_workspace(user_id: u64, workspace_id: u64) {
    WORKSPACE_CACHE.insert(user_id, workspace_id).await;
}

#[instrument]
async fn get_default_workspace(tenant_id: u64) -> uorm::Result<u64> {
    info!("Listing workspaces for tenant_id: {}", tenant_id);
    let workspaces = WorkspaceDao::list(tenant_id).await?;
    let workspace_id = if workspaces.is_empty() {
        info!("No workspaces found, creating default one");
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
