import * as datasourceService from '@/api/datasource.api';
import { createConnection, deleteConnection, getConnections, updateConnection } from '@/api/datasource.api';
import { ConnectionReq, ConnectionType } from '@/types/datasource.types';
import { Q, makeQ, run } from '@/utils/q';
import { proxy } from 'valtio'; // 数据库链接状态管理

// 数据库链接状态管理
interface DatasourceState {
  asyncConnections: Q<ConnectionType[]>;
  open: boolean;
  asyncCurrentConnection: Q<ConnectionType | void>;
  queryParams: ConnectionReq;
}

export const datasourceState = proxy<DatasourceState>({
  asyncConnections: makeQ([]),
  open: false,
  asyncCurrentConnection: makeQ(),
  queryParams: {},
});

// 获取数据库链接列表
export const fetchConnections = async (params?: ConnectionReq) => {
  const queryParams = params || datasourceState.queryParams;
  await run(datasourceState.asyncConnections, getConnections, queryParams);
};

// 更新查询参数
export const updateQueryParams = (params: Partial<ConnectionReq>) => {
  datasourceState.queryParams = { ...datasourceState.queryParams, ...params };
};

// 重置查询参数
export const resetQueryParams = () => {
  datasourceState.queryParams = {};
};

// 新增数据库链接
export const addConnection = async (connection: ConnectionType) => {
  await run(datasourceState.asyncCurrentConnection, createConnection, connection);
  const response = await datasourceService.createConnection(connection);
  datasourceState.asyncConnections.data?.push(response.data!);
  return response.data;
};

// 更新数据库链接
export const editConnection = async (id: string, connection: ConnectionType) => {
  await run(datasourceState.asyncCurrentConnection, updateConnection, id, connection);
  const response = await datasourceService.updateConnection(id, connection);
  const index = datasourceState.asyncConnections.data?.findIndex((conn) => conn.id === id);
  if (index && index !== -1) {
    datasourceState.asyncConnections.data![index] = response.data!;
  }
};

// 删除数据库链接
export const removeConnection = async (id: string) => {
  await run(datasourceState.asyncCurrentConnection, deleteConnection, id);
  const index = datasourceState.asyncConnections.data!.findIndex((conn) => conn.id === id);
  if (index !== -1) {
    datasourceState.asyncConnections.data!.splice(index, 1);
  }
};

// 打开新增/编辑弹窗
export const openModal = (connection?: ConnectionType) => {
  datasourceState.asyncCurrentConnection.data = connection;
  datasourceState.open = true;
};

// 关闭弹窗
export const closeModal = () => {
  datasourceState.open = false;
  datasourceState.asyncCurrentConnection.data = null;
};
