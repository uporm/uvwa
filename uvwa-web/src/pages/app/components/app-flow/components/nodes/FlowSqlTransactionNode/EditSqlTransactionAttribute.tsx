import DatasourcePage from '@/pages/datasource';
import { datasourceState, fetchConnections } from '@/stores/datasource.store';
import { SettingOutlined } from '@ant-design/icons';
import { Node } from '@xyflow/react';
import { Button, Drawer, Flex, Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';

interface LoopNodeProps {
  node: Node;
  onChange: (node: Node) => void;
}

export default () => {
  const dsState = useSnapshot(datasourceState);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // 组件加载时获取数据源列表
  useEffect(() => {
    fetchConnections();
  }, []);

  const handleConfigClick = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    // 关闭抽屉时重新获取数据源列表，以防有新增或修改
    setTimeout(() => {
      fetchConnections();
    }, 100); // 添加小延迟确保 drawer 完全关闭后再刷新
  };

  console.log('datasourceOptions:', dsState);

  // 将数据源转换为 Select 选项格式
  const datasourceOptions = (dsState.asyncConnections.data || []).map((conn) => ({
    label: `${conn.name} (${conn.key})`,
    value: conn.key,
    key: conn.key,
  }));

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item name="type" label="数据库连接" rules={[{ required: true, message: '请选择数据库连接' }]}>
          <Flex gap={3} align="center">
            <Select
              placeholder="请选择数据库连接"
              options={datasourceOptions}
              loading={dsState.asyncConnections.loading}
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
            <Button type={'text'} onClick={handleConfigClick} icon={<SettingOutlined />} />
          </Flex>
        </Form.Item>
      </Form>

      <Drawer
        title="数据源管理"
        placement="right"
        width="100vw"
        height="100vh"
        onClose={handleDrawerClose}
        open={open}
        destroyOnHidden
        push={false}
      >
        <DatasourcePage />
      </Drawer>
    </>
  );
};
