import { RedoOutlined, UndoOutlined } from '@ant-design/icons';
import { Panel } from '@xyflow/react';
import { Button, Divider, Flex, Tooltip } from 'antd';
import { memo, useEffect, useRef } from 'react';
import styles from './index.less';

const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const RedoBar = () => {
  return (
    <Panel position="bottom-center">
      <Flex className={styles.panel}>
        <Flex align="center">
          <Tooltip placement="top" title="撤销">
            <Button type="text" icon={<UndoOutlined />} />
          </Tooltip>

          <Tooltip placement="top" title="重做">
            <Button type="text" icon={<RedoOutlined />} />
          </Tooltip>
        </Flex>
        <Divider type="vertical" size={'small'} />
        <Tooltip placement="top" title="变更记录">
          <Button type="text" icon={<RedoOutlined />} />
        </Tooltip>
      </Flex>
    </Panel>
  );
};

export default memo(RedoBar);
