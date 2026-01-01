import { Edge, Node, XYPosition } from '@xyflow/react';

/**
 * 支持的脚本语言类型
 */
export type ScriptLanguage = 'javascript' | 'python';

/**
 * 变量校验规则
 */
export interface Rule {
  type: string;
  value?: string | boolean;
  message?: string;
}

/**
 * 支持的变量数据类型
 */
export type VariableKind =
  | 'STRING'
  | 'INTEGER'
  | 'LONG'
  | 'DECIMAL'
  | 'BOOLEAN'
  | 'OBJECT'
  | 'FILE'
  | 'FILE_IMAGE'
  | 'FILE_VIDEO'
  | 'FILE_AUDIO'
  | 'FILE_DOC'
  | 'FILE_OTHER'
  | 'ARRAY'
  | 'ARRAY_STRING'
  | 'ARRAY_INTEGER'
  | 'ARRAY_LONG'
  | 'ARRAY_DECIMAL'
  | 'ARRAY_BOOLEAN'
  | 'ARRAY_OBJECT'
  | 'ARRAY_FILE_IMAGE'
  | 'ARRAY_FILE_VIDEO'
  | 'ARRAY_FILE_AUDIO'
  | 'ARRAY_FILE_DOC'
  | 'ARRAY_FILE_OTHER';

/**
 * 变量树形节点接口
 */
export interface VariableNode {
  label: string;
  value?: VariableKind;
  tag?: string;
  children?: VariableNode[];
}

/**
 * 变量
 */
export interface Variable {
  id: string;
  name: string;
  type: VariableKind;
  value?: string;
  rules?: Rule[];
}

/**
 * 节点类型
 */
export interface NodeType<T extends Record<string, any>> extends Node {
  id: string;
  type: string;
  data: T;
  position: XYPosition;
  width?: number;
  height?: number;
  dragging?: boolean;
  draggable?: boolean;
}

export interface EdgeType<T extends Record<string, any>> extends Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: T;
}

/**
 * 节点配置项
 */
export interface NodeDefineType {
  icon: string;
  category: string;
  renderComponent: React.ComponentType<any>;
  attributeEditor?: React.ComponentType<any>;
  defaultConfig?: NodeType<any>;
}

/**
 * 开始节点类型
 */
export interface StartNodeType {
  title?: string;
  description?: string;
  input?: Variable[];
}

export interface EndNodeOutputType {
  title?: string;
  description?: string;
  vars: Variable[];
  isWrap?: boolean;
  rCode?: number;
  rMessage?: string;
  isText?: boolean;
  isStream?: boolean;
  text?: string;
}

/**
 * 脚本节点类型
 */
export interface EndNodeType {
  title?: string;
  description?: string;
  output?: EndNodeOutputType;
}

/**
 * 条件分支 - 条件
 */
export interface Condition {
  varId: string;
  opr: string;
  value: string;
}

/**
 * 条件分支 - 条件
 */
export interface Case {
  id: string;
  opr: string;
  conditions: Condition[];
}

/**
 * 条件分支
 */
export interface CaseNodeType {
  title?: string;
  description?: string;
  cases: Case[];
}

/**
 * 循环节点类型
 */
export interface LoopNodeType {
  title?: string;
  description?: string;
  type: 'for' | 'while' | 'forever';
  forVarId?: string;
  whileNumber?: number;
  bodyVarName: string;
  bodyIndexName: string;
  group: boolean;
  expanded: boolean;
}

/**
 * 脚本节点类型
 */
export interface CodeNodeType {
  title?: string;
  description?: string;
  language: ScriptLanguage;
  content: string;
  input?: Variable[];
  output?: Variable[];
  timeout?: number;
  /** 是否启用调试模式 */
  debug?: boolean;
}

export interface SqlNodeType {
  title?: string;
  description?: string;
  connKey: string;
  content: string;
  input?: Variable[];
  output?: Variable[];
}

export interface SqlTransactionNodeType {
  title?: string;
  description?: string;
  connKey: string;
  group: boolean;
  expanded: boolean;
}

export interface SubFlowNodeType {
  title?: string;
  description?: string;
  flowId: string;
  input?: Variable[];
  output?: Variable[];
}

export interface NoteNodeType {
  title?: string;
  description?: string;
  content: string;
}

export enum AppTypeEnum {
  All = 0,
  FLOW = 1,
  CHAT = 2,
  AUTONOMOUS = 3,
}

export interface AppType {
  id: string;
  type: AppTypeEnum;
  folderId: string;
  name: string;
  description?: string;
  tagIds?: string[];
  updatedTime: string;
}

export interface AppDetailType extends AppType {
  nodes: NodeType<any>[];
  edges: EdgeType<any>[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface CreateAppReq {
  folderId: string;
  name: string;
  description?: string;
  type: AppTypeEnum;
}

export interface UpdateAppReq {
  name: string;
  description?: string;
}

// 工作流查询参数
export interface ListAppReq {
  // 目录树选中的节点ID
  folderId?: string;
  // 类型：工作流/对话流/智能体
  type?: AppTypeEnum;
  // 标签过滤
  tagIds?: string[];
  // 名称搜索
  name?: string;
}
