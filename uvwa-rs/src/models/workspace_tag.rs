use crate::business::workspace_tag::tag_dao::Tag;
use crate::web::ts_str::to_str;
use serde::{Deserialize, Serialize};
use crate::utils::id::Id;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TagReq {
    pub name: String,
}

impl From<(u64, u64, i32, TagReq)> for Tag {
    fn from((tenant_id, workspace_id, tag_type, tag_req): (u64, u64, i32, TagReq)) -> Self {
        Self {
            id: Id::next_id().unwrap_or_default(),
            tenant_id,
            workspace_id,
            tag_type,
            name: tag_req.name,
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TagResp {
    #[serde(serialize_with = "to_str")]
    pub id: u64,
    pub name: String,
}

impl From<Tag> for TagResp {
    fn from(tag: Tag) -> Self {
        Self {
            id: tag.id,
            name: tag.name,
        }
    }
}
