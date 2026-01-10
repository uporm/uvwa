import IconFont from '@/components/icon-font';
import { NodeDefineTypes } from '@/pages/app/nodeTypes';
import { cloneNode, deleteNode, extendNode, setHoveredNodeId } from '@/stores/app-flow.store';
import { FlowNode } from '@/types/app.types';
import { CopyOutlined, DeleteOutlined, DownCircleOutlined, EllipsisOutlined, UpCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Flex, Space, theme } from 'antd';
import React, { memo, useCallback, useMemo } from 'react';
import styles from './styles.less';

const { useToken } = theme;

interface NodeWrapperProps {
  node: FlowNode<any>;
  children?: React.ReactNode;
}

const NodeWrapper: React.FC<NodeWrapperProps> = memo(({ node, children }) => {
  const isExpanded = node.data.expanded !== false;
  const { token } = useToken();

  const handleDeleteNode = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      deleteNode(node.id);
    },
    [node.id],
  );

  const handleCloneNode = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      cloneNode(node.id);
    },
    [node.id],
  );

  const handleToggleExpand = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      extendNode(node.id);
      setHoveredNodeId(null);
    },
    [node.id],
  );

  const dropdownMenuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'delete',
        label: (
          <div onClick={handleDeleteNode}>
            <DeleteOutlined /> 删除
          </div>
        ),
      },
      {
        key: 'clone',
        label: (
          <div onClick={handleCloneNode}>
            <CopyOutlined /> 创建副本
          </div>
        ),
      },
    ],
    [handleDeleteNode, handleCloneNode],
  );

  const expandButton = useMemo(() => {
    if (!node.data.group) return null;

    return (
      <Button
        type="text"
        size="small"
        icon={isExpanded ? <DownCircleOutlined /> : <UpCircleOutlined />}
        onClick={handleToggleExpand}
      />
    );
  }, [isExpanded, node.data.group, handleToggleExpand]);

  const nodeIcon = useMemo(
    () => <IconFont type={NodeDefineTypes[node.type].icon} style={{ color: token.colorPrimary, fontSize: 16 }} />,
    [node.type, token.colorPrimary],
  );

  return (
    <Flex vertical className={styles.nodeWrapper}>
      <Flex align="center" justify="space-between" className={styles.nodeHeader}>
        <Flex align="center" gap={5} className={styles.nodeInfo}>
          {nodeIcon}
          <span className={styles.nodeTitle}>{node.data.title}</span>
        </Flex>

        <Space size={0} className={styles.nodeActions}>
          {expandButton}
          <Dropdown menu={{ items: dropdownMenuItems }} placement="bottom" arrow>
            <Button type="text" size="small" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      </Flex>
      {children}
    </Flex>
  );
});

export default NodeWrapper;
