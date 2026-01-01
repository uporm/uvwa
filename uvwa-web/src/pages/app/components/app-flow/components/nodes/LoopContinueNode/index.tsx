import NodeWrapper from '@/pages/app/components/app-flow/components/node-wrapper';
import { NodeType } from '@/types/app.types';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: NodeType<any>) => {
  return (
    <NodeWrapper node={node}>
      <Handle type="target" position={Position.Left} />
    </NodeWrapper>
  );
});
