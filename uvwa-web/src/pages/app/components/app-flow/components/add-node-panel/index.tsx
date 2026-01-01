import IconFont from '@/components/icon-font';
import { NodeDefineTypes } from '@/pages/app/nodeTypes';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import React, { useMemo, useState } from 'react';
import styles from './index.module.less';

export interface AddNodePanelProps {
  onAddNode?: (nodeType: string) => void;
  onClose?: () => void;
}

const AddNodePanel: React.FC<AddNodePanelProps> = ({ onAddNode, onClose }) => {
  const groupedNodes = useMemo(() => {
    const map: Record<string, Array<{ type: string; title: string; icon: string }>> = {};
    Object.entries(NodeDefineTypes)
      .filter(([_, nodeConfig]) => !nodeConfig.defaultConfig?.data.hidden)
      .forEach(([nodeType, nodeConfig]) => {
        const category = nodeConfig.category || '未分类';
        const title = nodeConfig.defaultConfig?.data.title || nodeType;
        if (!map[category]) map[category] = [];
        map[category].push({ type: nodeType, title, icon: nodeConfig.icon });
      });
    return Object.entries(map).map(([category, items]) => ({ category, items }));
  }, []);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleItemClick = (type: string) => {
    onAddNode?.(type);
    onClose?.();
  };

  return (
    <div className={styles.panel}>
      {groupedNodes.map(({ category, items }) => {
        const isCollapsed = !!collapsed[category];
        const leftColumn: typeof items = [];
        const rightColumn: typeof items = [];
        items.forEach((item, idx) => {
          (idx % 2 === 0 ? leftColumn : rightColumn).push(item);
        });
        return (
          <div key={category} className={styles.category}>
            <Flex
              align="center"
              justify="space-between"
              className={styles.categoryHeader}
              onClick={() => toggleCategory(category)}
            >
              <span>{category}</span>
              {isCollapsed ? (
                <CaretRightOutlined style={{ fontSize: 10, color: 'var(--ant-color-text-tertiary)' }} />
              ) : (
                <CaretDownOutlined style={{ fontSize: 10, color: 'var(--ant-color-text-tertiary)' }} />
              )}
            </Flex>
            {!isCollapsed && (
              <Flex className={styles.itemsRow}>
                <Flex vertical className={styles.column}>
                  {leftColumn.map((it) => (
                    <Flex
                      key={it.type}
                      align="center"
                      gap={8}
                      className={styles.itemCard}
                      onClick={() => handleItemClick(it.type)}
                    >
                      <IconFont type={it.icon} style={{ fontSize: 16 }} />
                      <span>{it.title}</span>
                    </Flex>
                  ))}
                </Flex>
                <Flex vertical className={styles.column}>
                  {rightColumn.map((it) => (
                    <Flex
                      key={it.type}
                      align="center"
                      gap={8}
                      className={styles.itemCard}
                      onClick={() => handleItemClick(it.type)}
                    >
                      <IconFont type={it.icon} style={{ fontSize: 16 }} />
                      <span>{it.title}</span>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AddNodePanel;
