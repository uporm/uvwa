// 获取标签列表
import { R } from '@/types/common.types';
import { WorkspaceTag } from '@/types/workspace.types';
import request from '@/utils/request';
import { TagTypeEnum } from '@/types/enum.types';

export async function listTags(type: TagTypeEnum): Promise<R<WorkspaceTag[]>> {
  return request.get(`/uvwa/tags/${type}`);
}

export async function createTag(type: TagTypeEnum, data: WorkspaceTag): Promise<R<void>> {
  return request.post(`/uvwa/tags/${type}`, data);
}

// 更新工作流标签
export async function updateTag(type: TagTypeEnum, id: string, name: string): Promise<R<void>> {
  return request.put(`/uvwa/tags/${type}/${id}`, { name });
}

export async function deleteTag(type: TagTypeEnum, id: string): Promise<R<void>> {
  return request.delete(`/uvwa/tags/${type}/${id}`);
}
