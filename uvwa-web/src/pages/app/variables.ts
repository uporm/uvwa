import {
  VALIDATION_RULE_DEFAULT_MESSAGES,
  VALIDATION_RULE_TYPES,
  VARIABLE_TYPE_RULES_MAP,
  VARIABLE_TYPES,
} from '@/constants/app';
import { NodeDefineTypes } from '@/pages/app/nodeTypes';
import { FlowEdge, FlowNode, Variable, VariableKind, VariableNode } from '@/types/app.types';
import { Node } from '@xyflow/react';

/**
 * 递归获取指定节点的所有前置节点对象
 * @param nodeId 目标节点ID
 * @param edges 边数组
 * @param nodes 节点数组
 * @param visited 已访问的节点集合，用于避免循环引用
 * @returns 前置节点对象数组
 */
const getPreviousNodes = (
  nodeId: string,
  edges: FlowEdge<any>[],
  nodes: FlowNode<any>[],
  visited: Set<string> = new Set(),
): FlowNode<any>[] => {
  if (visited.has(nodeId)) {
    return [];
  }

  visited.add(nodeId);
  const previousNodes: FlowNode<any>[] = [];

  // 查找所有指向当前节点的边
  const incomingEdges = edges.filter((edge) => edge.target === nodeId);

  for (const edge of incomingEdges) {
    const sourceNodeId = edge.source;
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);

    if (sourceNode) {
      previousNodes.push(sourceNode);

      // 递归获取前置节点的前置节点
      const nestedPreviousNodes = getPreviousNodes(sourceNodeId, edges, nodes, new Set(visited));
      previousNodes.push(...nestedPreviousNodes);
    }
  }

  return previousNodes;
};

export interface AvailableVariable {
  nodeName: string;
  nodeIcon: string;
  varId: string;
  varName: string;
}

/**
 * 获取当前节点可用的变量列表（包含节点信息）
 * @param currentNodeId 当前节点ID
 * @param nodes 流程中的所有节点
 * @param edges 流程中的所有边
 * @returns 包含节点信息的变量列表
 */
export const getAvailableVariables = (
  currentNodeId: string,
  nodes: FlowNode<any>[],
  edges: FlowEdge<any>[],
): AvailableVariable[] => {
  const variablesWithNode: AvailableVariable[] = [];

  // 获取当前节点的所有前置节点对象
  const previousNodes = getPreviousNodes(currentNodeId, edges, nodes);

  // 遍历前置节点，收集变量
  previousNodes.forEach((node) => {
    const nodeData = node.data || {};
    const nodeName = (nodeData.title as string) || `节点${node.id}`;

    // 获取节点类型对应的图标
    const nodeType = node.type || '';
    const nodeDefine = NodeDefineTypes[nodeType];
    const nodeIcon = nodeDefine?.icon || 'icon-default';

    // 收集变量的辅助函数
    const addVariablesToList = (variables: Variable[]) => {
      variables.forEach((variable) => {
        variablesWithNode.push({
          nodeName,
          nodeIcon,
          varId: variable.id,
          varName: variable.name,
        });
      });
    };

    // 从开始节点获取输入变量
    if (nodeData.input && Array.isArray(nodeData.input)) {
      addVariablesToList(nodeData.input);
    }

    // 从其他节点获取输出变量
    if (nodeData.output && Array.isArray(nodeData.output)) {
      addVariablesToList(nodeData.output);
    }
  });

  return variablesWithNode;
};

const findVariableTypeLabel = (type: VariableKind): string => {
  const findInNodes = (nodes: VariableNode[]): string | null => {
    for (const node of nodes) {
      if (node.value === type) return node.label;
      if (node.children) {
        const found = findInNodes(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  return findInNodes(VARIABLE_TYPES) || type;
};

export const getVariableTypeLabel = (value: VariableKind): string => {
  const parts = value.split('_');
  if (parts.length === 1) {
    return findVariableTypeLabel(value);
  }

  const [outerType, ...innerParts] = parts;
  const outerLabel = findVariableTypeLabel(outerType as VariableKind);
  const innerType = innerParts.join('_') as VariableKind;
  const innerLabel = getVariableTypeLabel(innerType);

  return `${outerLabel}<${innerLabel}>`;
};

export const getAvailableRules = (variableType: string) => {
  const availableRuleTypes = VARIABLE_TYPE_RULES_MAP[variableType as keyof typeof VARIABLE_TYPE_RULES_MAP] || [];
  return VALIDATION_RULE_TYPES.filter((rule: any) => availableRuleTypes.includes(rule.value));
};

export const getDefaultErrorMessage = (ruleType: string, value?: string): string => {
  const template = VALIDATION_RULE_DEFAULT_MESSAGES[ruleType];
  if (!template) return '';

  // 对于需要参数的规则类型，如果没有提供值则返回基础模板
  if (!value) return template;

  // 处理不同类型的参数替换
  switch (ruleType) {
    case 'max':
    case 'min':
      return template.replace('{value}', value);
    case 'length':
    case 'size':
      // 处理范围值格式 "min,max"
      if (value.includes(',')) {
        const [min, max] = value.split(',');
        return template.replace('{min}', min || '0').replace('{max}', max || '∞');
      }
      return template;
    case 'enum':
      // 处理枚举值，假设用逗号分隔
      return template.replace('{options}', value);
    default:
      return template;
  }
};

/**
 * 根据变量 Id 获取变量名称和节点 title
 * @param variableId 变量ID
 * @param nodes 节点数组
 * @returns 变量信息对象，如果未找到则返回 null
 */
export const getVariableInfoById = (variableId: string, nodes: Node[]): AvailableVariable | null => {
  // 遍历所有节点，查找包含指定变量ID的节点
  for (const node of nodes) {
    const nodeData = node.data || {};

    // 获取节点类型对应的图标
    const nodeType = node.type || '';
    const nodeDefine = NodeDefineTypes[nodeType];
    const nodeIcon = nodeDefine?.icon || 'icon-default';
    const nodeName = (nodeData.title as string) || '未命名节点';

    // 查找变量的辅助函数
    const findVariableInArray = (variables: Variable[]): Variable | undefined => {
      return variables.find((v: Variable) => v.id === variableId);
    };

    // 创建返回对象的辅助函数
    const createVariableWithNode = (variable: Variable): AvailableVariable => {
      return {
        nodeName,
        nodeIcon,
        varId: variable.id,
        varName: variable.name,
      };
    };

    // 检查节点的输入变量
    if (nodeData.input && Array.isArray(nodeData.input)) {
      const variable = findVariableInArray(nodeData.input);
      if (variable) {
        return createVariableWithNode(variable);
      }
    }

    // 检查节点的输出变量
    if (nodeData.output && Array.isArray(nodeData.output)) {
      const variable = findVariableInArray(nodeData.output);
      if (variable) {
        return createVariableWithNode(variable);
      }
    }
  }

  // 如果没有找到变量，返回 null
  return null;
};
