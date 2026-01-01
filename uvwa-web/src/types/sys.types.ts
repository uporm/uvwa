// ==================== 目录相关类型定义 ====================
export enum FolderTypeEnum {
  APP = 1,
  KNOWLEDGE = 2,
}

export interface FolderType {
  id: string;
  name: string;
  parentId?: string;
  children?: FolderType[];
}

export interface CreateFolderReq {
  parentId?: string;
  name: string;
}

// ===================== 标签相关类型定义 ====================

export enum TagTypeEnum {
  APP = 1,
  KNOWLEDGE = 2,
}

export interface TagType {
  id: string;
  name: string;
}
