import { R } from '@/types/common.types'; // 获取工作流目录树
import { CreateWorkspaceFolderReq } from '@/types/workspace.types'; // 获取工作流目录树
import request from '@/utils/request';
import { FolderTypeEnum } from '@/types/enum.types';

// 获取目录树
export async function listFolders(type: FolderTypeEnum): Promise<R<any[]>> {
  return request.get(`/folders`, { folderType: type });
}

// 重命名目录
export async function renameFolder(id: string, name: string): Promise<R<void>> {
  return request.put(`/folders/${id}`, { name });
}

// 新建目录
export async function createFolder(data: CreateWorkspaceFolderReq): Promise<R<string>> {
  return request.post(`/folders`, data);
}

// 删除工作流目录
export async function deleteFolder(id: string): Promise<R<void>> {
  return request.delete(`/folders/${id}`);
}

// 移动工作流目录（更新父节点）
export async function moveFolder(id: string, parentId: string, seq?: number): Promise<R<void>> {
  return request.put(`/folders/${id}/move`, { parentId, seq });
}
