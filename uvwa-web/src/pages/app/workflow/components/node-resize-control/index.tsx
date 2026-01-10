import IconFont from '@/components/icon-font';
import { NodeResizeControl } from '@xyflow/react';
import { memo } from 'react';

interface FlowNodeResizeControlProps {
  style?: React.CSSProperties;
}

const FlowNodeResizeControl: React.FC<FlowNodeResizeControlProps> = memo(({ style }) => {
  return (
    <>
      <NodeResizeControl style={{ ...{ background: 'transparent', border: 'none' }, ...style }}>
        <IconFont type="icon-zoom" style={{ position: 'absolute', right: 3, bottom: 3 }} />
      </NodeResizeControl>
    </>
  );
});

export default FlowNodeResizeControl;