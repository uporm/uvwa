import { Card } from 'antd';
import React from 'react';
import styles from './styles.less';

/**
 * 节点面板组件
 * 显示可拖拽的节点类型列表
 */
const NodePanel: React.FC = () => {
  return <Card title="组件面板" variant="borderless" size="small" className={styles.card}></Card>;
};

export default NodePanel;
