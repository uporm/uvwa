import { AppType, CreateAppReq, ListAppReq, UpdateAppReq } from '@/types/app.types';
import { R } from '@/types/common.types'; // 获取单个工作流详情
import request from '@/utils/request';

// 获取单个工作流详情
export async function getAppContent(id: string): Promise<R<string>> {
  return request.get(`/upflow/apps/${id}/content`);
}

// 更新工作流内容
export async function updateAppContent(id: string, data: string): Promise<R<void>> {
  return request.put(`/upflow/apps/${id}/content`, { content: data });
}

// 获取工作流列表
export async function listApps(params?: ListAppReq): Promise<R<AppType[]>> {
  return request.get('/upflow/apps', params);
}

// 创建新工作流
export async function createApp(data: CreateAppReq): Promise<R<AppType>> {
  return request.post('/upflow/apps', data);
}

// 更新工作流
export async function updateApp(id: string, data: UpdateAppReq): Promise<R<void>> {
  return request.put(`/upflow/apps/${id}`, data);
}

// 删除工作流
export async function deleteApp(id: string): Promise<R<void>> {
  return request.delete(`/upflow/apps/${id}`);
}

// 复制工作流
export async function cloneApp(id: string, data: UpdateAppReq): Promise<R<void>> {
  return request.post(`/upflow/apps/${id}/clone`, { name: data.name, description: data.description });
}

export async function updateAppTag(id: string, tagIds: string[]): Promise<R<void>> {
  return request.put(`/upflow/apps/${id}/tags`, { tagIds });
}
