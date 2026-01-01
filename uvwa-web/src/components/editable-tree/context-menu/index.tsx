import { DeleteOutlined, EditOutlined, FolderAddOutlined } from '@ant-design/icons';
import { ConfigProvider, Menu, type MenuProps, theme } from 'antd';
import React, { useEffect } from 'react';
import styles from './styles.less';

// 菜单项定义
const items: MenuProps['items'] = [
  {
    label: '新建目录',
    key: 'new-folder',
    icon: <FolderAddOutlined />,
  },
  { type: 'divider' },
  {
    label: '重命名',
    key: 'rename',
    icon: <EditOutlined />,
  },
  {
    label: '删除',
    key: 'delete',
    icon: <DeleteOutlined />,
  },
];

// 右键菜单组件（受控显示与定位）
interface TreeContextMenuProps {
  open?: boolean;
  position?: { x: number; y: number };
  key?: React.Key;
  onClose?: () => void;
  onMenuClick?: (key: string) => void;
  // 右键菜单扩展能力：允许外部基于默认项扩展或替换
  getContextMenuItems?: (defaultItems: MenuProps['items']) => MenuProps['items'];
}

const TreeContextMenu: React.FC<TreeContextMenuProps> = ({
  open = false,
  position = { x: 0, y: 0 },
  onClose,
  onMenuClick,
  getContextMenuItems,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleGlobalClick = () => onClose?.();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };

    // 使用 click 和 Escape 关闭，避免在右键触发时立即被关闭
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleEscape);
    return () => {
      console.log('TreeContextMenu unmount');
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  // 计算实际展示的菜单项：默认项或外部扩展后的项（不能使用条件钩子）
  const computedItems: MenuProps['items'] = getContextMenuItems ? getContextMenuItems(items) : items;

  if (!open) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    zIndex: 10000,
    background: '#fff',
    boxShadow: '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
    borderRadius: 8,
    overflow: 'hidden',
  };

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    onMenuClick?.(String(key));
    onClose?.();
  };

  return (
    <div style={style} onContextMenu={(e) => e.preventDefault()}>
      <ConfigProvider
        theme={{
          algorithm: theme.compactAlgorithm,
          components: {
            Menu: {
              itemHeight: 28,
              itemPaddingInline: 12,
              itemMarginBlock: 4,
              iconSize: 14,
            },
          },
        }}
      >
        <Menu rootClassName={styles.menu} selectable={false} items={computedItems} onClick={handleClick} />
      </ConfigProvider>
    </div>
  );
};

export default TreeContextMenu;
