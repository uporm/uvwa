use crate::business::app::app_dao::App;
use crate::utils::id::Id;
use crate::web::ts_str::to_number;
use crate::web::ts_str::to_str;
use crate::web::ts_str::vec_to_str;
use crate::web::ts_str::vec_to_number;
use serde::{Deserialize, Serialize};
use uorm::Param;
use validator::Validate;

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct AppCreateReq {
    #[serde(deserialize_with = "to_number")]
    pub folder_id: u64,
    pub app_type: i32,
    pub name: String,
    pub description: Option<String>,
}

impl From<AppCreateReq> for App {
    fn from(req: AppCreateReq) -> Self {
        Self {
            id: Id::next_id().unwrap_or_default(),
            tenant_id: 0,
            workspace_id: 0,
            folder_id: req.folder_id,
            app_type: req.app_type,
            name: req.name,
            description: req.description,
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppUpdateReq {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppDraftUpdateReq {
    pub spec: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppTagUpdateReq {
    #[serde(deserialize_with = "vec_to_number")]
    pub tag_ids: Vec<u64>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppCloneReq {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppVersionReq {
    pub version: String,
    pub description: Option<String>,
}

#[derive(Deserialize, Serialize, Param, Default)]
#[serde(rename_all = "camelCase")]
pub struct AppReq {
    pub folder_id: Option<u64>,
    pub app_type: Option<i32>,
    pub name: Option<String>,
    pub tag_ids: Option<Vec<u64>>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppResp {
    #[serde(serialize_with = "to_str")]
    pub id: u64,
    #[serde(serialize_with = "to_str")]
    pub folder_id: u64,
    pub app_type: i32,
    pub name: String,
    pub description: Option<String>,
    #[serde(serialize_with = "vec_to_str")]
    pub tag_ids: Vec<u64>,
}
