use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppCreateReq {
    pub folder_id: u64,
    pub r#type: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppUpdateReq {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppContentUpdateReq {
    pub content: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppTagUpdateReq {
    pub tag_ids: Option<Vec<u64>>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppCloneReq {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppReleaseReq {
    pub version: String,
    pub description: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct AppQuery {
    pub folder_id: Option<u64>,
    pub r#type: Option<i32>,
    pub name: Option<String>,
    pub tag_ids: Option<Vec<u64>>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppVO {
    #[serde(serialize_with = "crate::web::ts_str::to_str")]
    pub id: u64,
    #[serde(serialize_with = "crate::web::ts_str::to_str")]
    pub folder_id: u64,
    pub r#type: i32,
    pub name: String,
    pub description: Option<String>,
    #[serde(serialize_with = "crate::web::ts_str::vec_to_str", skip_serializing_if = "Option::is_none")]
    pub tag_ids: Option<Vec<u64>>,
}
