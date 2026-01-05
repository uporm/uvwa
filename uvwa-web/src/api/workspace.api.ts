import { R } from '@/types/common.types';
import request from '@/utils/request';
import { Workspace } from '@/types/workspace.types';

// 创建工作空间
export async function createWorkspace(data: { name: string; description?: string }): Promise<R<Workspace>> {
  return request.post('/uvwa/workspaces', data);
}

// 获取工作空间列表
export async function getWorkspaces(): Promise<R<Workspace[]>> {
  return request.get('/uvwa/workspaces');
}

// 设置当前工作空间
export async function setCurrentWorkspace(workspaceId: string): Promise<R<null>> {
  return request.put(`/uvwa/workspaces/${workspaceId}/current`);
}
