import FlowNodeResizeControl from '@/pages/app/components/app-flow/components/node-resize-control';
import NodeWrapper from '@/pages/app/components/app-flow/components/node-wrapper';
import { FlowNode } from '@/types/app.types';
import React, { memo, useState } from 'react';

/**
 * 分组节点包装器的属性接口
 */
interface GroupNodeProps {
  /** 节点数据 */
  node: FlowNode<any>;
  /** 子组件 */
  children?: React.ReactNode;
}

/**
 * 分组节点包装器组件
 *
 * 为分组类型的节点提供特殊的交互功能：
 * - 鼠标悬停时显示调整大小控件
 * - 只有在节点是分组且已展开状态下才显示控件
 */
const GroupNodeWrapper = memo<GroupNodeProps>(({ node, children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ height: '100%', width: '100%' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <NodeWrapper node={node}>
        {node.data.group && node.data.expanded && (
          <FlowNodeResizeControl style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? 'auto' : 'none' }} />
        )}
        {children}
      </NodeWrapper>
    </div>
  );
});

export default GroupNodeWrapper;
