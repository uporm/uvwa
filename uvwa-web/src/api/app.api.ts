import { App, CreateAppReq, ListAppReq, UpdateAppReq } from '@/types/app.types';
import { R } from '@/types/common.types'; // 获取单个工作流详情
import request from '@/utils/request';

// 获取单个工作流草稿
export async function getAppDraft(id: string): Promise<R<string>> {
  return request.get(`/uvwa/apps/${id}/draft`);
}

// 更新工作流草稿
export async function updateAppDraft(id: string, spec: string): Promise<R<void>> {
  return request.put(`/uvwa/apps/${id}/draft`, { spec });
}

// 获取工作流列表
export async function listApps(params?: ListAppReq): Promise<R<App[]>> {
  return request.get('/uvwa/apps', params);
}

// 创建新工作流
export async function createApp(data: CreateAppReq): Promise<R<App>> {
  return request.post('/uvwa/apps', data);
}

// 更新工作流
export async function updateApp(id: string, data: UpdateAppReq): Promise<R<void>> {
  return request.put(`/uvwa/apps/${id}`, data);
}

// 删除工作流
export async function deleteApp(id: string): Promise<R<void>> {
  return request.delete(`/uvwa/apps/${id}`);
}

// 复制工作流
export async function cloneApp(id: string, data: UpdateAppReq): Promise<R<void>> {
  return request.post(`/uvwa/apps/${id}/clone`, { name: data.name, description: data.description });
}

export async function updateAppTag(id: string, tagIds: string[]): Promise<R<void>> {
  return request.put(`/uvwa/apps/${id}/tags`, { tagIds });
}
