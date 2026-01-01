import NodeWrapper from '@/pages/app/components/app-flow/components/node-wrapper';
import { CodeNodeType, NodeType } from '@/types/app.types';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: NodeType<CodeNodeType>) => {
  return (
    <NodeWrapper node={node}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </NodeWrapper>
  );
});
