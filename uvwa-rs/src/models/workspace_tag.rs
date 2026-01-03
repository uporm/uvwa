use crate::business::workspace_tag::tag_dao::Tag;
use crate::web::ts_str::to_str;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TagReq {
    pub name: String,
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
