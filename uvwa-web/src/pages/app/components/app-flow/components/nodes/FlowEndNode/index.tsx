import NodeWrapper from '@/pages/app/components/app-flow/components/node-wrapper';
import { EndNode, FlowNode } from '@/types/app.types';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: FlowNode<EndNode>) => {
  return (
    <NodeWrapper node={node}>
      <Handle type="target" position={Position.Left} />
    </NodeWrapper>
  );
});
