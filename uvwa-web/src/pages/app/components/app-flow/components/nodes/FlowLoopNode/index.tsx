import GroupNodeWrapper from '@/pages/app/components/app-flow/components/group-node-wrapper';
import { LoopNode, FlowNode } from '@/types/app.types';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: FlowNode<LoopNode>) => {
  return (
    <GroupNodeWrapper node={node}>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </GroupNodeWrapper>
  );
});
