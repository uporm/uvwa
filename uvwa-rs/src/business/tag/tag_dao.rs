use uorm::{Param, sql};

#[derive(Param)]
pub struct Tag {
    pub id: u64,
    pub tenant_id: u64,
    pub workspace_id: u64,
    pub _type: i32,
    pub name: String,
}

impl Tag {
    pub fn new(id: u64, tenant_id: u64, workspace_id: u64, _type: i32, name: String) -> Self {
        Tag {
            id,
            tenant_id,
            workspace_id,
            _type,
            name,
        }
    }
}

#[sql("tag")]
pub struct TagDao;

impl TagDao {
    #[sql("insert")]
    pub async fn insert(tag: Tag) -> uorm::Result<()> {
        exec!()
    }

    #[sql("update")]
    pub async fn update(tag: Tag) -> uorm::Result<()> {
        exec!()
    }

    #[sql("delete")]
    pub async fn delete(tenant_id: u64, workspace_id: u64, r#type: i32, id: u64) -> uorm::Result<()> {
        exec!()
    }

    #[sql("list")]
    pub async fn list(tenant_id: u64, workspace_id: u64, r#type: i32) -> uorm::Result<Vec<Tag>> {
        exec!()
    }
}
