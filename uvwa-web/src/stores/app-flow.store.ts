import { getAppContent, updateAppContent } from '@/api/app.api';
import { NODE_TYPE, NodeDefineTypes } from '@/pages/app/nodeTypes';
import { getAllChildrenIds, sortNodes } from '@/pages/app/util';
import { EdgeType, NodeType } from '@/types/app.types';
import { newId } from '@/utils/id';
import { message } from 'antd';
import { proxy, subscribe } from 'valtio';

interface NodeSize {
  id: string;
  width: number;
  height: number;
}

const NodeSizeMap: Record<string, NodeSize> = {};

export const flowContentState = proxy({
  nodes: [] as NodeType<any>[],
  edges: [] as EdgeType<any>[],
});

// 工作流编辑相关状态
export const flowEditorState = proxy({
  selectedNode: null as NodeType<any> | null,
  hoveredNodeId: null as string | null,
  currentAppId: null as string | null,
  lastSaved: '' as string,
});

export const initSubscribe = () => {
  return subscribe(flowContentState, scheduleAutoSave);
};

// ==================== 工作流编辑相关函数 ====================

export const fetchAppContent = async (id: string) => {
  const r = await getAppContent(id);
  const appContent = JSON.parse(r.data || '{}');
  flowContentState.nodes = appContent.nodes || [];
  flowContentState.edges = appContent.edges || [];
  flowEditorState.currentAppId = id;
  flowEditorState.lastSaved = JSON.stringify({ nodes: flowContentState.nodes, edges: flowContentState.edges });
};

let saveTimer: any = null;
const scheduleAutoSave = () => {
  if (!flowEditorState.currentAppId) return;

  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    // 构建流程数据并序列化
    const serialized = JSON.stringify({
      nodes: flowContentState.nodes.map((node) => {
        const savedSize = NodeSizeMap[node.id];
        return savedSize ? { ...node, width: savedSize.width, height: savedSize.height } : node;
      }),
      edges: flowContentState.edges,
    });

    // 如果没有变化则跳过保存
    if (serialized === flowEditorState.lastSaved) return;

    await updateAppContent(flowEditorState.currentAppId!, serialized);
    flowEditorState.lastSaved = serialized;
  }, 800);
};

export const setSelectedNode = (node: NodeType<any> | null) => {
  flowEditorState.selectedNode = node;
};

export const setHoveredNodeId = (nodeId: string | null) => {
  flowEditorState.hoveredNodeId = nodeId;
};

export const setNodes = (nodes: NodeType<any>[]) => {
  console.log('setNodes', nodes);
  flowContentState.nodes = nodes;
};

export const setEdges = (edges: EdgeType<any>[]) => {
  console.log('setEdges', edges);
  flowContentState.edges = edges;
};

export const addNode = (type: string, position: { x: number; y: number }) => {
  let startNode = flowContentState.nodes.find((n) => n.type === NODE_TYPE.START);
  if (type === NODE_TYPE.START && startNode) {
    message.info('流程中只能有一个开始节点！');
    return;
  }
  let node = NodeDefineTypes[type];
  let id = newId();
  let nodes: NodeType<any>[] = [];
  const newNode: NodeType<any> = {
    id,
    type,
    position,
    width: node.defaultConfig?.width,
    height: node.defaultConfig?.height,
    data: { ...node.defaultConfig?.data },
  };
  nodes.push(newNode);

  if (type === NODE_TYPE.LOOP) {
    let groupStartNodeCfg = NodeDefineTypes[NODE_TYPE.GROUP_START];
    const groupStartNode = {
      ...groupStartNodeCfg.defaultConfig,
      type: NODE_TYPE.GROUP_START,
      position: groupStartNodeCfg.defaultConfig?.position!,
      data: { ...groupStartNodeCfg.defaultConfig?.data },
      id: newId(),
      parentId: id,
    };
    nodes.push(groupStartNode);
  }

  flowContentState.nodes.push(...nodes);
};

export const updateNode = (node: NodeType<any>) => {
  let nodes = flowContentState.nodes.map((n) => (n.id === node.id ? node : n));
  flowContentState.nodes = sortNodes(nodes);

  // 如果被更新的节点是当前选中的节点，同步更新选中状态
  if (flowEditorState.selectedNode && flowEditorState.selectedNode.id === node.id) {
    flowEditorState.selectedNode = node;
  }
};

export const deleteNode = (nodeId: string) => {
  let childrenNodes = getAllChildrenIds(nodeId, flowContentState.nodes);
  let nodes = flowContentState.nodes.filter((n) => n.id !== nodeId && !childrenNodes.includes(n.id));
  let edges = flowContentState.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
  flowContentState.nodes = nodes;
  flowContentState.edges = edges;

  // 如果被删除的节点是当前选中的节点，清除选中状态
  if (flowEditorState.selectedNode && flowEditorState.selectedNode.id === nodeId) {
    flowEditorState.selectedNode = null;
  }
};

export const cloneNode = (nodeId: string) => {
  // 找到要克隆的节点
  const sourceNode = flowContentState.nodes.find((n) => n.id === nodeId);
  if (!sourceNode) {
    message.error('未找到要克隆的节点！');
    return;
  }

  // 检查是否为开始节点，开始节点不能克隆
  if (sourceNode.type === 'start') {
    message.info('开始节点不能被克隆！');
    return;
  }

  // 深拷贝节点数据
  const clonedData = JSON.parse(JSON.stringify(sourceNode.data));

  // 创建克隆节点，位置稍微偏移避免重叠
  const clonedNode: NodeType<any> = {
    ...sourceNode,
    id: newId(),
    data: clonedData,
    zIndex: sourceNode.zIndex! + 1,
    selected: false,
    position: {
      x: sourceNode.position!.x + 50, // 向右偏移50px
      y: sourceNode.position!.y + 50, // 向下偏移50px
    },
  };

  // 添加克隆节点到状态中
  flowContentState.nodes = flowContentState.nodes.concat(clonedNode);
};

// 容器节点收起时的尺寸常量
const COLLAPSED_NODE_HEIGHT = 40;
const COLLAPSED_NODE_MAX_WIDTH = 220;
const DEFAULT_NODE_WIDTH = 220;
const DEFAULT_NODE_HEIGHT = 100;

export const extendNode = (nodeId: string) => {
  // 使用 Map 优化查找性能
  const nodeMap = new Map(flowContentState.nodes.map((node) => [node.id, node]));
  const currentNode = nodeMap.get(nodeId);

  if (!currentNode) {
    console.warn(`Node with id ${nodeId} not found`);
    return;
  }

  // 获取节点类型配置
  const nodeConfig = NodeDefineTypes[currentNode.type!];
  if (!nodeConfig) {
    console.warn(`Node type ${currentNode.type} not found in NodeDefineTypes`);
    return;
  }

  // 获取当前展开状态，默认为true（展开）
  const currentExpanded = currentNode.data?.expanded !== false;
  const newExpanded = !currentExpanded;

  // 优化：一次性获取所有需要更新的节点
  const childrenNodeIds = getAllChildrenIds(nodeId, flowContentState.nodes);
  const nodesToUpdate = new Set([nodeId, ...childrenNodeIds]);

  // 更新所有相关节点
  flowContentState.nodes = flowContentState.nodes.map((node) => {
    if (!nodesToUpdate.has(node.id)) {
      return node;
    }

    // 更新当前节点
    if (node.id === nodeId) {
      const updatedNode = {
        ...node,
        data: {
          ...node.data,
          expanded: newExpanded,
        },
      };

      // 如果是容器节点，处理尺寸变化
      if (nodeConfig?.defaultConfig?.data.group) {
        if (newExpanded) {
          // 展开：从 map 中恢复尺寸，如果没有则使用默认尺寸
          const savedSize = NodeSizeMap[nodeId];
          if (savedSize) {
            updatedNode.width = savedSize.width;
            updatedNode.height = savedSize.height;
          } else {
            updatedNode.width = nodeConfig.defaultConfig?.width || node.width;
            updatedNode.height = nodeConfig.defaultConfig?.height || node.height;
          }
        } else {
          // 收起：先记录当前尺寸到 map 中，再缩小尺寸
          NodeSizeMap[nodeId] = {
            id: nodeId,
            width: node.width || nodeConfig.defaultConfig?.width || DEFAULT_NODE_WIDTH,
            height: node.height || nodeConfig.defaultConfig?.height || DEFAULT_NODE_HEIGHT,
          };

          // 缩小尺寸，只显示标题栏
          updatedNode.width = Math.min(node.width || DEFAULT_NODE_WIDTH, COLLAPSED_NODE_MAX_WIDTH);
          updatedNode.height = COLLAPSED_NODE_HEIGHT;
        }
      }

      return updatedNode;
    }

    // 处理子节点的显示/隐藏
    if (childrenNodeIds.includes(node.id)) {
      return {
        ...node,
        hidden: !newExpanded, // 收起时隐藏子节点，展开时显示子节点
      };
    }

    return node;
  });
};
