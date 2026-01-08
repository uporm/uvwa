use crate::business::workspace_tag::tag_dao::TagDao;
use crate::models::context::Context;
use crate::models::workspace_tag::{TagReq, TagResp};
use crate::r;
use crate::web::code::Code;
use crate::web::error::WebError;
use crate::web::extract::Json;
use crate::web::r::R;
use axum::extract::Path;

// 查询标签列表
pub async fn list_tags(ctx: Context, Path(tag_type): Path<i32>) -> R<Vec<TagResp>> {
    let tags = r!(TagDao::list(ctx.tenant_id, ctx.workspace_id, tag_type).await);

    let tags = tags
        .into_iter()
        .map(|tag| tag.into())
        .collect::<Vec<TagResp>>();
    R::ok(tags)
}

// 创建标签
pub async fn create_tag(
    ctx: Context,
    Path(tag_type): Path<i32>,
    Json(req): Json<TagReq>,
) -> R<String> {
    let tag = (ctx.tenant_id, ctx.workspace_id, tag_type, req).into();
    r!(TagDao::insert(&tag).await);
    R::ok(tag.id.to_string())
}

// 更新标签
pub async fn update_tag(
    ctx: Context,
    Path((tag_type, id)): Path<(i32, u64)>,
    Json(req): Json<TagReq>,
) -> R<()> {
    let mut tag = match r!(TagDao::get(ctx.tenant_id, ctx.workspace_id, tag_type, id).await) {
        Some(tag) => tag,
        None => return R::err(WebError::Biz(Code::TagNotExist.into())),
    };

    tag.name = req.name;
    r!(TagDao::update(&tag).await);
    R::void()
}

// 删除标签
pub async fn delete_tag(ctx: Context, Path((tag_type, id)): Path<(i32, u64)>) -> R<()> {
    r!(TagDao::delete(ctx.tenant_id, ctx.workspace_id, tag_type, id).await);
    R::void()
}
