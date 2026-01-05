import { AppTypeEnum } from '@/types/enum.types';
import { Edge, Node, XYPosition } from '@xyflow/react';
import React from 'react';

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
export interface FlowNode<T extends Record<string, any>> extends Node {
  id: string;
  type: string;
  data: T;
  position: XYPosition;
  width?: number;
  height?: number;
  dragging?: boolean;
  draggable?: boolean;
}

export interface FlowEdge<T extends Record<string, any>> extends Edge {
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
export interface FlowNodeDefine {
  icon: string;
  category: string;
  renderComponent: React.ComponentType<any>;
  attributeEditor?: React.ComponentType<any>;
  defaultConfig?: FlowNode<any>;
}

/**
 * 开始节点类型
 */
export interface StartNode {
  title?: string;
  description?: string;
  input?: Variable[];
}

export interface EndNodeOutput {
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
export interface EndNode {
  title?: string;
  description?: string;
  output?: EndNodeOutput;
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
export interface CaseNode {
  title?: string;
  description?: string;
  cases: Case[];
}

/**
 * 循环节点类型
 */
export interface LoopNode {
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
export interface CodeNode {
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

export interface SqlNode {
  title?: string;
  description?: string;
  connKey: string;
  content: string;
  input?: Variable[];
  output?: Variable[];
}

export interface SqlTransactionNode {
  title?: string;
  description?: string;
  connKey: string;
  group: boolean;
  expanded: boolean;
}

export interface SubFlowNode {
  title?: string;
  description?: string;
  flowId: string;
  input?: Variable[];
  output?: Variable[];
}

export interface NoteNode {
  title?: string;
  description?: string;
  content: string;
}

export interface App {
  id: string;
  type: AppTypeEnum;
  folderId: string;
  name: string;
  description?: string;
  tagIds?: string[];
  updatedTime: string;
}

export interface AppDraft extends App {
  nodes: FlowNode<any>[];
  edges: FlowEdge<any>[];
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
  appType: AppTypeEnum;
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
  appType?: AppTypeEnum;
  // 标签过滤
  tagIds?: string[];
  // 名称搜索
  name?: string;
}
