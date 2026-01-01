import IconFont from '@/components/icon-font';
import { FileImageOutlined, PlusOutlined } from '@ant-design/icons';
import { Panel } from '@xyflow/react';
import { Button, Divider, Flex, Popover, Radio, Tooltip } from 'antd';
import { memo, useEffect, useRef, useState } from 'react';
import AddNodePanel from '../add-node-panel';
import styles from './index.less';

const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const ActionBar = () => {
  const [open, setOpen] = useState(false);

  const handleAddNode = (type: string) => {
    console.log('add node', type);
    setOpen(false);
  };

  return (
    <Panel position="bottom-center">
      <Flex className={styles.panel}>
        <Flex align="center">
          <Popover
            placement="top"
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            content={<AddNodePanel onAddNode={handleAddNode} onClose={() => setOpen(false)} />}
            overlayStyle={{ zIndex: 1000 }}
          >
            <Button color="default" variant="filled" size={'small'} icon={<PlusOutlined />}>
              添加节点
            </Button>
          </Popover>

          <Tooltip placement="top" title="添加注释">
            <Button type="text" icon={<IconFont type="icon-file" />} />
          </Tooltip>
        </Flex>
        <Divider type="vertical" size={'small'} />
        <Flex align="center">
          <Radio.Group size="small" defaultValue="a" optionType="button" buttonStyle="solid">
            <Radio.Button value="a">
              <IconFont type="icon-cursor" />
            </Radio.Button>
            <Radio.Button value="b">
              <IconFont type="icon-hand" />
            </Radio.Button>
          </Radio.Group>
          <Divider type="vertical" size={'small'} />
          <Flex align={'center'}>
            <Tooltip placement="top" title="导出图片">
              <Button size={'small'} type="text" icon={<FileImageOutlined />} />
            </Tooltip>
            <Tooltip placement="top" title="缩略图">
              <Button size={'small'} type="text" icon={<IconFont type="icon-xiaoditu" />} />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Panel>
  );
};

export default memo(ActionBar);
