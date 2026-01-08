use crate::business::workspace::workspace_dao::Workspace;
use crate::web::ts_str::to_str;
use serde::{Deserialize, Serialize};
use crate::utils::id::Id;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceReq {
    pub name: String,
    pub description: Option<String>,
}

impl From<(WorkspaceReq, u64)> for Workspace {
    fn from((req, tenant_id): (WorkspaceReq, u64)) -> Self {
        Self {
            id: Id::next_id().unwrap_or_default(),
            tenant_id,
            name: req.name,
            description: req.description,
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceResp {
    #[serde(serialize_with = "to_str")]
    pub id: u64,
    pub name: String,
    pub description: Option<String>,
    pub selected: bool,
}

impl From<Workspace> for WorkspaceResp {
    fn from(workspace: Workspace) -> Self {
        Self {
            id: workspace.id,
            name: workspace.name,
            description: workspace.description,
            selected: false,
        }
    }
}
