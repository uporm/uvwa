// 获取标签列表
import { R } from '@/types/common.types';
import { TagType, TagTypeEnum } from '@/types/sys.types';
import request from '@/utils/request';

export async function listTags(type: TagTypeEnum): Promise<R<TagType[]>> {
  return request.get(`/upflow/sys/tags/${type}`);
}

export async function createTag(type: TagTypeEnum, data: TagType): Promise<R<void>> {
  return request.post(`/upflow/sys/tags/${type}`, data);
}

// 更新工作流标签
export async function updateTag(type: TagTypeEnum, id: string, name: string): Promise<R<void>> {
  return request.put(`/upflow/sys/tags/${type}/${id}`, { name });
}

export async function deleteTag(type: TagTypeEnum, id: string): Promise<R<void>> {
  return request.delete(`/upflow/sys/tags/${type}/${id}`);
}
