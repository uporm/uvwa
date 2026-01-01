export interface ObjectType<T> {
  [key: string]: T;
}

export interface TreeType {
  id: number;
  name: string;
  parentId: number;
  children?: TreeType[];
}

export interface PageReq {
  pageNo?: number;
  pageSize?: number;
}

// 分页列表返回参数
export interface PageType<T> {
  total: number; // 总数量
  items: T[];
}

export interface R<T> {
  readonly code: number;
  readonly data?: T;
  readonly message?: string;
}
