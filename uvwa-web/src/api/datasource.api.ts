import { R } from '@/types/common.types';
import { ConnectionReq, ConnectionType } from '@/types/datasource.types';
import request from '@/utils/request';

// 获取数据库链接列表
export async function getConnections(params?: ConnectionReq): Promise<R<ConnectionType[]>> {
  return request.get('/datasource/connections', params);
}

// 新增数据库链接
export async function createConnection(data: ConnectionType): Promise<R<ConnectionType>> {
  return request.post('/datasource/connections', data);
}

// 更新数据库链接
export async function updateConnection(id: string, data: ConnectionType): Promise<R<ConnectionType>> {
  return request.put(`/datasource/connections/${id}`, data);
}

// 删除数据库链接
export async function deleteConnection(id: string): Promise<R<void>> {
  return request.delete(`/datasource/connections/${id}`);
}
