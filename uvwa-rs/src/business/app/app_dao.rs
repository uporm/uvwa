use crate::models::app::AppQuery;
use crate::web::ts_str::to_str;
use serde::Serialize;
use uorm::{Param, sql};

#[derive(Param, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct App {
    #[serde(serialize_with = "to_str")]
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    #[serde(serialize_with = "to_str")]
    pub folder_id: u64,
    pub _type: i32,
    pub name: String,
    pub description: Option<String>,
    pub tag_ids_str: Option<String>,
}

#[derive(Param, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppContent {
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    pub app_id: u64,
    pub content: String,
}

#[derive(Param, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppRelease {
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    pub app_id: u64,
    pub version: String,
    pub major: Option<i32>,
    pub minor: Option<i32>,
    pub patch: Option<i32>,
    pub pre_release: Option<String>,
    pub description: Option<String>,
    pub is_latest: bool,
}

#[derive(Param, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppReleaseContent {
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    pub app_release_id: u64,
    pub content: String,
}

#[sql("app")]
pub struct AppDao;

impl AppDao {
    // #[sql("list")]
    pub async fn list(
        tenant_id: u64,
        workspace_id: u64,
        query: &AppQuery,
    ) -> uorm::Result<Vec<App>> {
        // exec!()
        Ok(vec![])
    }

    #[sql("getById")]
    pub async fn get_by_id(
        tenant_id: u64,
        workspace_id: u64,
        id: u64,
    ) -> uorm::Result<Option<App>> {
        exec!()
    }

    #[sql("insert")]
    pub async fn insert(app: &App) -> uorm::Result<u64> {
        exec!()
    }

    #[sql("update")]
    pub async fn update(app: &App) -> uorm::Result<()> {
        exec!()
    }

    #[sql("delete")]
    pub async fn delete(tenant_id: u64, workspace_id: u64, id: u64) -> uorm::Result<()> {
        exec!()
    }

    #[sql("deleteByFolderId")]
    pub async fn delete_by_folder_id(
        tenant_id: u64,
        workspace_id: u64,
        folder_id: u64,
    ) -> uorm::Result<()> {
        exec!()
    }

    #[sql("batchInsertAppTags")]
    pub async fn batch_insert_app_tags(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
        tag_ids: &Vec<u64>,
    ) -> uorm::Result<()> {
        exec!()
    }

    #[sql("deleteAppTag")]
    pub async fn delete_app_tag(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
    ) -> uorm::Result<()> {
        exec!()
    }

    #[sql("deleteAppTagByTagId")]
    pub async fn delete_app_tag_by_tag_id(
        tenant_id: u64,
        workspace_id: u64,
        tag_id: u64,
    ) -> uorm::Result<()> {
        exec!()
    }

    #[sql("getContent")]
    pub async fn get_content(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
    ) -> uorm::Result<Option<AppContent>> {
        exec!()
    }

    #[sql("insertOrUpdateContent")]
    pub async fn insert_or_update_content(content: &AppContent) -> uorm::Result<()> {
        exec!()
    }

    #[sql("deleteContent")]
    pub async fn delete_content(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
    ) -> uorm::Result<()> {
        exec!()
    }

    #[sql("cancelLatest")]
    pub async fn cancel_latest(tenant_id: u64, workspace_id: u64, app_id: u64) -> uorm::Result<()> {
        exec!()
    }

    #[sql("insertRelease")]
    pub async fn insert_release(release: &AppRelease) -> uorm::Result<u64> {
        exec!()
    }

    #[sql("insertReleaseContent")]
    pub async fn insert_release_content(content: &AppReleaseContent) -> uorm::Result<u64> {
        exec!()
    }

    #[sql("deleteReleases")]
    pub async fn delete_releases(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
    ) -> uorm::Result<()> {
        exec!()
    }

    #[sql("deleteReleaseContent")]
    pub async fn delete_release_content(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
    ) -> uorm::Result<()> {
        exec!()
    }
}
