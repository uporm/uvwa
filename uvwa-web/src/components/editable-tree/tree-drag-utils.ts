import type { TreeDataNode } from 'antd';

export interface MoveNodeResult {
  tree: TreeDataNode[];
  parentId: string;
  position: number; // 从 1 开始
}

export const moveNode = (
  nodes: TreeDataNode[],
  dragKey: string,
  dropKey: string,
  dropPosition: number,
  dropToGap: boolean,
): MoveNodeResult => {
  let draggedNode: TreeDataNode | null = null;

  const removeNode = (list: TreeDataNode[]): TreeDataNode[] =>
    list
      .map((node) => {
        if (node.key === dragKey) {
          draggedNode = node;
          return null;
        }
        if (node.children) {
          return { ...node, children: removeNode(node.children).filter(Boolean) as TreeDataNode[] };
        }
        return node;
      })
      .filter(Boolean) as TreeDataNode[];

  const newNodes = removeNode(nodes);
  if (!draggedNode) return { tree: newNodes, parentId: '', position: 1 };

  let parentId: string = '';
  let position: number = 1;

  const insertNode = (list: TreeDataNode[]): TreeDataNode[] =>
    list
      .map((node) => {
        if (node.key === dropKey) {
          if (dropToGap) {
            parentId = '';
            position = dropPosition === -1 ? 1 : 2; // +1 调整序号从1开始
            return dropPosition === -1 ? [draggedNode, node] : [node, draggedNode];
          } else {
            parentId = node.key as string;
            position = 1; // 插入到子节点开头，从1开始
            const children = node.children ? [draggedNode, ...node.children] : [draggedNode];
            return { ...node, children };
          }
        }
        if (node.children) {
          return { ...node, children: insertNode(node.children) };
        }
        return node;
      })
      .flat() as TreeDataNode[];

  const tree = insertNode(newNodes);
  return { tree, parentId: parentId || dropKey, position };
};
