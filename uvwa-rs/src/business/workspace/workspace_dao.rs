use crate::utils::id::Id;
use uorm::{Param, sql};

#[derive(Param, Clone)]
pub struct Workspace {
    pub tenant_id: u64,
    pub id: u64,
    pub name: String,
    pub description: Option<String>,
}

impl Workspace {
    pub fn new(tenant_id: u64) -> Self {
        Workspace {
            tenant_id,
            id: Id::next_id().unwrap_or_default(),
            name: "默认工作空间".to_string(),
            description: Some("默认工作空间".to_string()),
        }
    }
}

#[sql("workspace")]
pub struct WorkspaceDao;

impl WorkspaceDao {
    #[sql("insert")]
    pub async fn insert(workspace: &Workspace) -> uorm::Result<()> {
        exec!()
    }

    #[sql("update")]
    pub async fn update(workspace: Workspace) -> uorm::Result<()> {
        exec!()
    }

    #[sql("delete")]
    pub async fn delete(tenant_id: u64, id: u64) -> uorm::Result<()> {
        exec!()
    }

    #[sql("list")]
    pub async fn list(tenant_id: u64) -> uorm::Result<Vec<Workspace>> {
        exec!()
    }

    #[sql("get")]
    pub async fn get(tenant_id: u64, id: u64) -> uorm::Result<Option<Workspace>> {
        exec!()
    }
}
