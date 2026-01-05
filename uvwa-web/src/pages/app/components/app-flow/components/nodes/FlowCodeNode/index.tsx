import NodeWrapper from '@/pages/app/components/app-flow/components/node-wrapper';
import { CodeNode, FlowNode } from '@/types/app.types';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: FlowNode<CodeNode>) => {
  return (
    <NodeWrapper node={node}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </NodeWrapper>
  );
});
