import { R } from '@/types/common.types';
import request from '@/utils/request';

// 获取工作空间列表
export async function getWorkspaces(): Promise<R<WorkspaceType[]>> {
  return request.get('/upflow/workspaces');
}

// 获取当前工作空间
export async function getCurrentWorkspace(): Promise<R<string>> {
  return request.get('/upflow/workspaces/current');
}

// 设置当前工作空间
export async function setCurrentWorkspace(workspaceId: string): Promise<R<null>> {
  return request.put(`/upflow/workspaces/${workspaceId}/current`);
}
