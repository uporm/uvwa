// 获取标签列表
import { R } from '@/types/common.types';
import { TagTypeEnum } from '@/types/enum.types';
import { WorkspaceTag } from '@/types/workspace.types';
import request from '@/utils/request';

export async function listTags(type: TagTypeEnum): Promise<R<WorkspaceTag[]>> {
  return request.get(`/tags`, { tagType: type });
}

export async function createTag(data: WorkspaceTag): Promise<R<void>> {
  return request.post(`/tags`, data);
}

// 更新工作流标签
export async function updateTag(id: string, name: string): Promise<R<void>> {
  return request.put(`/tags/${id}`, { name });
}

export async function deleteTag(id: string): Promise<R<void>> {
  return request.delete(`/tags/${id}`);
}
