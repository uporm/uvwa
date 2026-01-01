import NodeWrapper from '@/pages/app/components/app-flow/components/node-wrapper';
import { EndNodeType, NodeType } from '@/types/app.types';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: NodeType<EndNodeType>) => {
  return (
    <NodeWrapper node={node}>
      <Handle type="target" position={Position.Left} />
    </NodeWrapper>
  );
});
