use crate::business::workspace_tag::tag_dao::{Tag, TagDao};
use crate::models::context::Context;
use crate::models::workspace_tag::{TagReq, TagResp};
use crate::r;
use crate::utils::id::Id;
use crate::web::extract::Json;
use crate::web::r::R;
use axum::extract::Path;

// 查询标签列表
pub async fn list_tags(ctx: Context, Path(tag_type): Path<i32>) -> R<Vec<TagResp>> {
    let mut tags = r!(TagDao::list(ctx.tenant_id, ctx.workspace_id, tag_type).await);

    // 如果标签列表为空，则创建一个默认标签
    if tags.is_empty() {
        let default_tag = Tag::new(
            None,
            ctx.tenant_id,
            ctx.workspace_id,
            tag_type,
            "默认标签".to_string(),
        );
        r!(TagDao::insert(&default_tag).await);
        tags = r!(TagDao::list(ctx.tenant_id, ctx.workspace_id, tag_type).await);
    }

    let tags = tags
        .into_iter()
        .map(|tag| tag.into())
        .collect::<Vec<TagResp>>();
    R::ok(tags)
}

// 创建新标签
pub async fn create_tag(
    ctx: Context,
    Path(tag_type): Path<i32>,
    Json(req): Json<TagReq>,
) -> R<String> {
    let tag = Tag::new(None, ctx.tenant_id, ctx.workspace_id, tag_type, req.name);
    r!(TagDao::insert(&tag).await);
    R::ok(tag.id.to_string())
}

// 更新系统标签
pub async fn update_tag(
    ctx: Context,
    Path((tag_type, id)): Path<(i32, u64)>,
    Json(req): Json<TagReq>,
) -> R<()> {
    let tag = Tag::new(
        Some(id),
        ctx.tenant_id,
        ctx.workspace_id,
        tag_type,
        req.name,
    );
    r!(TagDao::update(tag).await);
    R::void()
}

// 删除系统标签
pub async fn delete_tag(ctx: Context, Path((tag_type, id)): Path<(i32, u64)>) -> R<()> {
    r!(TagDao::delete(ctx.tenant_id, ctx.workspace_id, tag_type, id).await);
    R::void()
}
