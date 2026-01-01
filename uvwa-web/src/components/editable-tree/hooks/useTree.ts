import { moveNode, MoveNodeResult } from '@/components/editable-tree/tree-drag-utils';
import { treeUtils } from '@/components/editable-tree/tree-utils';
import { TreeDataNode } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

interface EditNode {
  key?: React.Key; // 节点的唯一标识符
  value?: string; // 节点的标题
  parentKey?: React.Key; // 父节点的唯一标识符
  isNew?: boolean; // 标识是否为新创建的节点
}

export interface Options {
  expandAll?: boolean;
  initialValue: TreeDataNode[];
  onSelect?: (selectedKey: React.Key | undefined, info: any) => void;
  onCreate?: (parentKey: React.Key, name: string) => Promise<React.Key>;
  onRename?: (key: React.Key, name: string) => Promise<void>;
  onDelete?: (key: React.Key) => Promise<void>;
  onMove?: (id: React.Key, parentKey: React.Key, index?: number) => Promise<void>;
  onMenuClick?: (key: string, nodeKey?: React.Key) => void;
  onChange?: (nodes: TreeDataNode[]) => void;
}

export function useTree(options: Options) {
  const { expandAll, initialValue, onSelect, onCreate, onRename, onDelete, onMove, onMenuClick, onChange } = options;
  const [datasource, setDatasource] = useState(initialValue);
  const [editNode, setEditNode] = useState<EditNode>({});
  const [selectedNodeIds, setSelectedNodeIds] = useState<React.Key[]>([]);
  const [expandedNodeIds, setExpandedNodeIds] = useState<React.Key[]>([]);
  useEffect(() => {
    setExpandedNodeIds(expandAll ? treeUtils.getAllNodeKeys(initialValue) : []);
  }, [initialValue, expandAll]);

  useEffect(() => {
    setDatasource(initialValue);
  }, [initialValue]);

  /**
   * 开始编辑指定节点
   *
   * @param key 需要编辑的节点键值
   */
  const startEdit = useCallback(
    (key: React.Key) => {
      console.log('startEdit', key);
      const title = treeUtils.findTitle(initialValue, key) ?? '';
      setEditNode({ key, value: title });
    },
    [initialValue, setEditNode],
  );

  /**
   * 取消当前编辑操作
   * 如果是新创建的节点，则从树中删除该节点
   */
  const cancelEdit = useCallback(() => {
    // 如果是新节点，需要从数据中移除
    if (editNode.isNew) {
      setDatasource((prev) => {
        const updated = treeUtils.removeNode(prev, editNode.key!);
        onChange?.(updated);
        return updated;
      });
    }
    setEditNode({});
  }, [editNode, setEditNode]);

  const selectNode = useCallback(
    (keys: React.Key[], info: any) => {
      onSelect?.(keys?.[0], info);
      setSelectedNodeIds(keys);
    },
    [selectedNodeIds],
  );

  const expandNode = useCallback(
    (keys: React.Key[]) => {
      setExpandedNodeIds(keys);
    },
    [expandedNodeIds],
  );

  /**
   * 创建新节点
   *
   * @param parentKey 父节点键值，如果未提供则作为根节点添加
   */
  const createNode = useCallback(
    (parentKey?: React.Key) => {
      const tempKey = `temp-${Date.now()}`;
      const child: TreeDataNode = { key: tempKey, title: '' };

      // 根据是否有父节点决定添加方式
      if (!parentKey) {
        setDatasource((prev) => {
          const updated = [...prev, child];
          onChange?.(updated);
          return updated;
        });
      } else {
        setDatasource((prev) => {
          const updated = treeUtils.addChild(prev, parentKey, child);
          onChange?.(updated);
          return updated;
        });
        setExpandedNodeIds((prev) => (prev.includes(parentKey) ? prev : [...prev, parentKey]));
      }

      setEditNode({ key: tempKey, value: '', parentKey: parentKey, isNew: true });
    },
    [setEditNode],
  );

  const confirmEditNode = useCallback(
    async (value: string) => {
      if (editNode.isNew) {
        const res = await onCreate?.(editNode.parentKey!, value);
        setDatasource((prev) => {
          const updated = treeUtils.updateNode(prev, editNode.key!, { key: res, title: value });
          onChange?.(updated);
          return updated;
        });
      } else {
        await onRename?.(editNode.key!, value);
        setDatasource((prev) => {
          const updated = treeUtils.updateNode(prev, editNode.key!, { title: value });
          onChange?.(updated);
          return updated;
        });
      }

      setEditNode({});
    },
    [editNode],
  );

  const confirmDeleteNode = useCallback(
    (key?: React.Key) => {
      onDelete?.(key!);
      setDatasource((prev) => {
        const updated = treeUtils.removeNode(prev, key);
        onChange?.(updated);
        return updated;
      });
      setSelectedNodeIds((prev) => prev.filter((k) => k !== key));
      setExpandedNodeIds((prev) => prev.filter((k) => k !== key));
    },
    [datasource, selectedNodeIds, expandedNodeIds],
  );

  const dropNode = useCallback(
    (info: any) => {
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const { tree, parentId, position }: MoveNodeResult = moveNode(
        datasource,
        info.dragNode.key as string,
        info.node.key as string,
        dropPosition,
        info.dropToGap,
      );
      setDatasource(tree);
      onChange?.(tree);
      onMove?.(info.dragNode.key, parentId, position);
    },
    [datasource, expandedNodeIds],
  );

  return {
    datasource,
    editNode,
    selectedNodeIds,
    expandedNodeIds,
    startEdit,
    cancelEdit,
    selectNode,
    expandNode,
    createNode,
    confirmEditNode,
    confirmDeleteNode,
    dropNode,
  };
}
