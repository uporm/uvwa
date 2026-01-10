import { App, CreateAppReq, ListAppReq, UpdateAppReq } from '@/types/app.types';
import { R } from '@/types/common.types'; // 获取单个工作流详情
import request from '@/utils/request';

// 获取单个工作流草稿
export async function getAppSpec(id: string): Promise<R<string>> {
  return request.get(`/apps/${id}/spec`);
}

// 更新工作流草稿
export async function updateAppSpec(id: string, spec: string): Promise<R<void>> {
  return request.put(`/apps/${id}/spec`, { spec });
}

// 获取工作流列表
export async function listApps(params?: ListAppReq): Promise<R<App[]>> {
  return request.get('/apps', params);
}

// 创建新工作流
export async function createApp(data: CreateAppReq): Promise<R<App>> {
  return request.post('/apps', data);
}

// 更新工作流
export async function updateApp(id: string, data: UpdateAppReq): Promise<R<void>> {
  return request.put(`/apps/${id}`, data);
}

// 删除工作流
export async function deleteApp(id: string): Promise<R<void>> {
  return request.delete(`/apps/${id}`);
}

// 复制工作流
export async function cloneApp(id: string, data: UpdateAppReq): Promise<R<void>> {
  return request.post(`/apps/${id}/clone`, data);
}

export async function updateAppTag(id: string, tagIds: string[]): Promise<R<void>> {
  return request.put(`/apps/${id}/tags`, { tagIds });
}
