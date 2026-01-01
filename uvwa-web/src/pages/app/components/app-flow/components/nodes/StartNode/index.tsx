import IconFont from '@/components/icon-font';
import NodeResizeControl from '@/pages/app/components/app-flow/components/node-resize-control';
import NodeWrapper from '@/pages/app/components/app-flow/components/node-wrapper';
import { getVariableTypeLabel } from '@/pages/app/variables';
import { NodeType, StartNodeType } from '@/types/app.types';
import { Handle, Position } from '@xyflow/react';
import { Flex, Space, theme } from 'antd';
import { memo } from 'react';
import styles from './styles.less';

const { useToken } = theme;
export default memo((node: NodeType<StartNodeType>) => {
  const { token } = useToken();
  // 获取变量数据
  const variables = node.data.input || [];

  return (
    <NodeWrapper node={node}>
      <Flex vertical className="node-container" gap={5}>
        {variables.map((item: any) => (
          <Flex justify="space-between" align="center" className={styles.variable} key={item.name}>
            <Space size={3}>
              <IconFont type="icon-variable" style={{ color: token.colorPrimary }} />
              {item.name}
              {item.rules && item.rules.length > 0 && (
                <label
                  style={{
                    marginLeft: '5px',
                    color: token.colorPrimary,
                  }}
                >
                  ({item.rules.length} rules)
                </label>
              )}
            </Space>
            <label className={styles.rules}>{getVariableTypeLabel(item.type)}</label>
          </Flex>
        ))}
      </Flex>
      <Handle type="source" position={Position.Right} />
      <NodeResizeControl />
    </NodeWrapper>
  );
});
