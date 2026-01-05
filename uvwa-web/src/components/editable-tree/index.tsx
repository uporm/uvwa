import EditInput from '@/components/editable-tree/edit-input';
import { useMenu } from '@/components/editable-tree/hooks/useMenu';
import { useTree } from '@/components/editable-tree/hooks/useTree';
import { type MenuProps, Modal, Tree, TreeDataNode } from 'antd';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import TreeContextMenu from './context-menu';
import styles from './styles.less';

// ==================== 类型定义 ====================
export interface EditableTreeProps {
  value?: TreeDataNode[];
  expandAll?: boolean;
  onSelect?: (selectedKey: React.Key | undefined, info: any) => void;
  onCreate?: (parentKey: React.Key, name: string) => Promise<React.Key>;
  onRename?: (key: React.Key, name: string) => Promise<void>;
  onDelete?: (key: React.Key) => Promise<void>;
  onMove?: (id: React.Key, parentKey: React.Key, index?: number) => Promise<void>;
  onMenuClick?: (key: string, nodeKey?: React.Key) => void;
  onChange?: (nodes: TreeDataNode[]) => void;

  // 右键菜单扩展能力
  getMenuItems?: (defaultItems: MenuProps['items']) => MenuProps['items'];
}

// 组件外部可调用的方法
export interface EditableTreeRef {
  /** 从外部触发创建一个根节点，并进入重命名编辑态 */
  createRootNode: (title?: string) => void;
}

const EditableTree = forwardRef<EditableTreeRef, EditableTreeProps>((props, ref) => {
  const { value = [], expandAll, onSelect, onCreate, onRename, onDelete, onMove, onMenuClick, onChange, getMenuItems } = props;

  const { menu, showMenu, hideMenu } = useMenu();
  const {
    datasource,
    editNode,
    selectedNodeIds,
    expandedNodeIds,
    startEdit,
    cancelEdit,
    selectNode,
    expandNode,
    createNode,
    confirmDeleteNode,
    confirmEditNode,
    dropNode,
  } = useTree({ expandAll, initialValue: value, onSelect, onCreate, onRename, onDelete, onMove, onMenuClick, onChange });

  const createRootNode = () => {
    if (editNode.key) {
      createNode(menu.nodeId);
    } else {
      createNode('0');
    }
  };
  // 暴露给外部的可调用方法
  useImperativeHandle(
    ref,
    () => ({
      createRootNode,
    }),
    [createRootNode],
  );

  /**
   * 处理右键菜单点击
   */
  const handleMenuClick = useCallback(
    (key: string) => {
      onMenuClick?.(String(key));

      switch (String(key)) {
        case 'new-folder':
          createNode(menu.nodeId);
          break;
        case 'rename':
          startEdit(menu.nodeId!);
          break;
        case 'delete':
          Modal.confirm({
            title: '确认删除',
            content: '确定要删除该目录及其所属的应用吗？此操作不可恢复。',
            okText: '删除',
            cancelText: '取消',
            onOk: () => confirmDeleteNode(menu.nodeId),
          });
          break;
        default:
          props.onMenuClick?.(String(key), menu.nodeId);
          break;
      }
    },
    [menu.nodeId, createNode, startEdit, confirmDeleteNode, props.onMenuClick],
  );

  // ==================== 渲染逻辑 ====================
  /**
   * 渲染可编辑的树数据
   */
  const renderTreeData = useMemo(() => {
    const applyEditableTitle = (nodes: TreeDataNode[]): TreeDataNode[] => {
      return nodes.map((node) => {
        return {
          ...node,
          title: (
            <EditInput
              disabled={editNode.key !== node.key}
              initialValue={node.title as string}
              onConfirm={confirmEditNode}
              onCancel={cancelEdit}
            />
          ),
          children: node.children ? applyEditableTitle(node.children as TreeDataNode[]) : undefined,
        };
      });
    };
    return applyEditableTitle(datasource);
  }, [datasource, editNode.key, editNode.value]);

  return (
    <>
      <Tree
        blockNode
        showLine={true}
        draggable={{ icon: false }}
        treeData={renderTreeData}
        selectedKeys={selectedNodeIds}
        expandedKeys={expandedNodeIds}
        selectable={!editNode.key}
        className={styles.editableTree}
        onDrop={dropNode}
        onSelect={selectNode}
        onExpand={expandNode}
        onRightClick={showMenu}
      />
      <TreeContextMenu
        open={menu.open}
        position={menu.position}
        onClose={hideMenu}
        onMenuClick={handleMenuClick}
        getContextMenuItems={getMenuItems}
      />
    </>
  );
});

export default EditableTree;
