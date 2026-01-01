import { DATABASE_TYPES } from '@/constants/app';
import {
  datasourceState,
  fetchConnections,
  openModal,
  removeConnection,
  resetQueryParams,
  updateQueryParams,
} from '@/stores/datasource.store';
import { ConnectionType } from '@/types/datasource.types';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, message, Popconfirm, Select, Space, Table } from 'antd';
import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import ConnectionDrawer from './components/ConnectionDrawer';

const DatasourcePage: React.FC = () => {
  const state = useSnapshot(datasourceState);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await removeConnection(id);
      message.success('删除成功');
    } catch (error) {
      // request.ts 已处理错误提示
      console.error('删除失败:', error);
    }
  };

  const handleEdit = (record: ConnectionType) => {
    openModal(record);
  };

  const handleAdd = () => {
    openModal();
  };

  const handleSearch = async () => {
    const values = form.getFieldsValue();
    const queryParams = {
      name: values.name?.trim() || undefined,
      type: values.type || undefined,
    };
    updateQueryParams(queryParams);
    await fetchConnections(queryParams);
  };

  const handleReset = async () => {
    form.resetFields();
    resetQueryParams();
    await fetchConnections({});
  };

  const columns = [
    {
      title: '连接标识符',
      dataIndex: 'key',
      key: 'key',
      width: 120,
    },
    {
      title: '连接名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '数据库类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => type?.toUpperCase() || '-',
    },
    {
      title: 'JDBC连接地址',
      dataIndex: 'url',
      key: 'url',
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      width: 120,
      render: (password: string) => '●'.repeat(password.length),
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ConnectionType) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个数据库链接吗？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 查询条件和操作按钮 */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '6px' }}
      >
        <Form form={form} layout="inline">
          <Form.Item name="name" label="连接名称">
            <Input placeholder="请输入连接名称" style={{ width: 200 }} allowClear />
          </Form.Item>
          <Form.Item name="type" label="数据库类型">
            <Select placeholder="请选择数据库类型" style={{ width: 150 }} allowClear options={DATABASE_TYPES} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增连接
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={state.asyncConnections.data || []}
        rowKey="id"
        loading={state.asyncConnections.loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1200 }}
      />

      <ConnectionDrawer />
    </div>
  );
};

export default DatasourcePage;
