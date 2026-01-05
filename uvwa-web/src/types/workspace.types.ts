// 工作空间类型定义
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  selected: boolean;
}

// ==================== 目录相关类型定义 ====================


export interface WorkspaceFolder {
  id: string;
  name: string;
  parentId?: string;
  children?: WorkspaceFolder[];
}

export interface CreateFolderReq {
  parentId?: string;
  name: string;
}

// ===================== 标签相关类型定义 ====================

export interface WorkspaceTag {
  id: string;
  name: string;
}
