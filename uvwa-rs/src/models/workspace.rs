use crate::business::workspace::workspace_dao::Workspace;
use crate::web::ts_str::to_str;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceReq {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceResp {
    #[serde(serialize_with = "to_str")]
    pub id: u64,
    pub name: String,
    pub description: Option<String>,
}

impl From<Workspace> for WorkspaceResp {
    fn from(workspace: Workspace) -> Self {
        Self {
            id: workspace.id,
            name: workspace.name,
            description: workspace.description,
        }
    }
}
