import { NodeDefineTypes } from '@/pages/app/nodeTypes';
import { getAllChildrenIds, getNodeAbsolutePosition } from '@/pages/app/util';
import {
  flowContentState,
  flowEditorState,
  setEdges,
  setHoveredNodeId,
  setNodes,
  setSelectedNode,
  updateNode,
} from '@/stores/app-flow.store';
import { EdgeType, NodeType } from '@/types/app.types';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  getOutgoers,
  Node,
  NodeChange,
  useReactFlow,
} from '@xyflow/react';
import { type MouseEvent as ReactMouseEvent, useCallback, useState } from 'react';
import { useSnapshot } from 'valtio';

const deepClone = <T,>(v: T): T => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

export const useApp = () => {
  const appContentSnap = useSnapshot(flowContentState);
  const appSnap = useSnapshot(flowEditorState);
  const { getIntersectingNodes } = useReactFlow();
  const [dropNodeIds, setDropNodeIds] = useState<string[] | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (changes.length === 0) {
        return;
      }
      const currentNodes = deepClone(appContentSnap.nodes as Node[]);
      const newNodes = applyNodeChanges(changes, currentNodes) as NodeType<any>[];

      // 如果当前有节点但新的结果为空，且不是明确的删除操作，则忽略
      if (currentNodes.length > 0 && newNodes.length === 0) {
        const hasRemoveChanges = changes.some((change) => change.type === 'remove');
        if (!hasRemoveChanges) {
          console.warn('Prevented nodes from being cleared by onNodesChange');
          return;
        }
      }

      // 检测选择状态变化
      const selectChanges = changes.filter((change) => change.type === 'select');

      if (selectChanges.length > 0) {
        // 找到被选中的节点
        const selectedChange = selectChanges.find((change) => change.selected === true);

        if (selectedChange) {
          // 找到对应的节点并更新 selectedNode
          const selectedNode = currentNodes.find((node) => node.id === selectedChange.id);
          if (selectedNode) {
            setSelectedNode(selectedNode as NodeType<any>);
          }
        } else {
          // 如果没有节点被选中，清空 selectedNode
          setSelectedNode(null);
        }
      }

      // 检测删除节点变化
      const removeChanges = changes.filter((change) => change.type === 'remove');
      if (removeChanges.length > 0 && appSnap.selectedNode) {
        // 检查当前选中的节点是否被删除
        const isSelectedNodeRemoved = removeChanges.some((change) => change.id === appSnap.selectedNode?.id);
        if (isSelectedNodeRemoved) {
          setSelectedNode(null);
        }
      }

      setNodes(newNodes);
    },
    [appContentSnap.nodes, appSnap.selectedNode],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, appContentSnap.edges as Edge[]) as EdgeType<any>[]);
    },
    [appContentSnap.edges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges(addEdge(connection, appContentSnap.edges as EdgeType<any>[]));
    },
    [appContentSnap.edges],
  );

  const onNodeDrag = useCallback(
    (event: any, draggedNode: Node) => {
      // 清除悬停状态，移除 node-hovered 样式
      setHoveredNodeId(null);

      // 获取拖拽节点的所有子节点ID
      const childrenIds = getAllChildrenIds(draggedNode.id, appContentSnap.nodes as readonly NodeType<any>[]);
      const intersectingNodes = getIntersectingNodes(draggedNode).filter(
        (node) =>
          NodeDefineTypes[node.type!]?.defaultConfig?.data.group === true &&
          node.id !== draggedNode.id &&
          !childrenIds.includes(node.id),
      );
      const newDropNodeIds = intersectingNodes.map((node) => node.id);
      setDropNodeIds(newDropNodeIds);
    },
    [getIntersectingNodes, appContentSnap.nodes],
  );

  const onNodeDragStop = useCallback(
    (event: ReactMouseEvent, draggedNode: Node) => {
      console.log('onNodeDragStop', draggedNode);
      setDropNodeIds([]);
      // 获取拖拽节点的所有子节点ID
      const childrenIds = getAllChildrenIds(draggedNode.id, appContentSnap.nodes as readonly NodeType<any>[]);
      const intersectingNodes = getIntersectingNodes(draggedNode).filter(
        (node) =>
          NodeDefineTypes[node.type!]?.defaultConfig?.data.group === true &&
          node.id !== draggedNode.id &&
          !childrenIds.includes(node.id),
      );

      // 节点移出父节点
      if (intersectingNodes.length <= 0) {
        if (draggedNode.parentId) {
          // 使用新的函数计算绝对位置，支持多层嵌套
          let absolutePosition = getNodeAbsolutePosition(draggedNode.id, appContentSnap.nodes as readonly Node[]);
          updateNode({
            ...draggedNode,
            type: draggedNode.type!,
            parentId: undefined,
            position: absolutePosition,
          });
        }
        return;
      }
      console.log('onNodeDragStop1', draggedNode, intersectingNodes);
      // 节点移入父节点
      let targetNode = intersectingNodes[intersectingNodes.length - 1];
      // 拖拽节点父节点为空
      if (!draggedNode.parentId) {
        let relativePosition = {
          x: draggedNode.position.x - targetNode.position.x,
          y: draggedNode.position.y - targetNode.position.y,
        };
        updateNode({
          ...draggedNode,
          type: draggedNode.type!,
          parentId: targetNode.id,
          position: relativePosition,
        });
        return;
      }
      console.log('onNodeDragStop2', draggedNode);
      // 在同一个父节点内拖动，不处理
      if (draggedNode.parentId === targetNode.id) {
        return;
      }
      // 节点移入其他父节点
      // 使用新的函数计算当前节点的绝对位置，支持多层嵌套
      let absolutePosition = getNodeAbsolutePosition(draggedNode.id, appContentSnap.nodes as readonly Node[]);
      // 计算目标父节点的绝对位置
      let targetAbsolutePosition = getNodeAbsolutePosition(targetNode.id, appContentSnap.nodes as readonly Node[]);
      let relativePosition = {
        x: absolutePosition.x - targetAbsolutePosition.x,
        y: absolutePosition.y - targetAbsolutePosition.y,
      };
      updateNode({ ...draggedNode, type: draggedNode.type!, parentId: targetNode.id, position: relativePosition });
      console.log('onNodeDragStop3', draggedNode);
    },
    [appContentSnap.nodes],
  );

  const onNodeMouseEnter = useCallback((_: ReactMouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback((_: ReactMouseEvent) => {
    setHoveredNodeId(null);
  }, []);

  const onValidConnection = useCallback(
    (connection: Edge | Connection) => {
      const target = appContentSnap.nodes.find((node: any) => node.id === connection.target);
      if (!target) return false;
      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, appContentSnap.nodes as Node[], appContentSnap.edges as Edge[])) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target.id === connection.source) return false;
      return !hasCycle(target as Node);
    },
    [appContentSnap.nodes, appContentSnap.edges],
  );

  return {
    hoveredNodeId: appSnap.hoveredNodeId,
    setHoveredNodeId,
    dropNodeIds,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDrag,
    onNodeDragStop,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onValidConnection,
  };
};
