import { R } from '@/types/common.types'; // 获取工作流目录树
import { CreateFolderReq, FolderTypeEnum } from '@/types/sys.types'; // 获取工作流目录树
import request from '@/utils/request';

// 获取目录树
export async function listFolders(type: FolderTypeEnum): Promise<R<any[]>> {
  return request.get(`/upflow/sys/folders/${type}`);
}

// 重命名目录
export async function renameFolder(type: FolderTypeEnum, id: string, name: string): Promise<R<void>> {
  return request.put(`/upflow/sys/folders/${type}/${id}`, { name });
}

// 新建目录
export async function createFolder(type: FolderTypeEnum, data: CreateFolderReq): Promise<R<string>> {
  return request.post(`/upflow/sys/folders/${type}`, data);
}

// 删除工作流目录
export async function deleteFolder(type: FolderTypeEnum, id: string): Promise<R<void>> {
  return request.delete(`/upflow/sys/folders/${type}/${id}`);
}

// 移动工作流目录（更新父节点）
export async function moveFolder(type: FolderTypeEnum, id: string, parentId: string, seq?: number): Promise<R<void>> {
  return request.put(`/upflow/sys/folders/${type}/${id}/move`, { parentId, seq });
}
