use crate::models::app::AppReq;
use uorm::{Param, sql};

#[derive(Param)]
pub struct App {
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    pub folder_id: u64,
    pub app_type: i32,
    pub name: String,
    pub description: Option<String>,
}

impl App {
    pub fn tenant_id(&mut self, tenant_id: u64) -> &mut Self {
        self.tenant_id = tenant_id;
        self
    }

    pub fn workspace_id(&mut self, workspace_id: u64) -> &mut Self {
        self.workspace_id = workspace_id;
        self
    }
}

#[derive(Param)]
pub struct AppTag {
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    pub app_id: u64,
    pub tag_id: u64,
}

#[derive(Param)]
pub struct AppDraft {
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    pub app_id: u64,
    pub spec: String,
}

#[derive(Param)]
pub struct AppVersion {
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

#[derive(Param)]
pub struct AppVersionSpec {
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    pub app_version_id: u64,
    pub spec: String,
}

#[sql("app")]
pub struct AppDao;

impl AppDao {
    #[sql("list")]
    pub async fn list(tenant_id: u64, workspace_id: u64, query: &AppReq) -> uorm::Result<Vec<App>> {
        exec!()
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

    #[sql("listAppTagsByAppIds")]
    pub async fn list_app_tags_by_app_ids(
        tenant_id: u64,
        workspace_id: u64,
        app_ids: &Vec<u64>,
    ) -> uorm::Result<Vec<AppTag>> {
        exec!()
    }

    #[sql("getDraft")]
    pub async fn get_draft(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
    ) -> uorm::Result<Option<AppDraft>> {
        exec!()
    }

    #[sql("insertOrUpdateDraft")]
    pub async fn insert_or_update_draft(draft: &AppDraft) -> uorm::Result<()> {
        exec!()
    }

    #[sql("deleteDraft")]
    pub async fn delete_draft(tenant_id: u64, workspace_id: u64, app_id: u64) -> uorm::Result<()> {
        exec!()
    }

    #[sql("cancelLatest")]
    pub async fn cancel_latest(tenant_id: u64, workspace_id: u64, app_id: u64) -> uorm::Result<()> {
        exec!()
    }

    #[sql("insertVersion")]
    pub async fn insert_version(version: &AppVersion) -> uorm::Result<u64> {
        exec!()
    }

    #[sql("insertVersionSpec")]
    pub async fn insert_version_spec(content: &AppVersionSpec) -> uorm::Result<u64> {
        exec!()
    }

    #[sql("deleteVersions")]
    pub async fn delete_versions(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
    ) -> uorm::Result<()> {
        exec!()
    }

    #[sql("deleteVersionSpecs")]
    pub async fn delete_version_spec(
        tenant_id: u64,
        workspace_id: u64,
        app_id: u64,
    ) -> uorm::Result<()> {
        exec!()
    }
}
