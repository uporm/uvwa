// 数据库链接类型定义
import { PageReq } from '@/types/common.types';

export interface ConnectionType {
  id: string;
  key: string;
  name: string;
  type: string;
  url: string;
  username: string;
  password: string;
  createTime: string;
}

// 数据库链接列表查询参数
export interface ConnectionReq extends PageReq {
  name?: string;
  type?: string;
}
