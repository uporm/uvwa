import { DATABASE_TYPES } from '@/constants/app';
import { addConnection, closeModal, datasourceState, editConnection } from '@/stores/datasource.store';
import { ConnectionType } from '@/types/datasource.types';
import { Button, Drawer, Form, Input, message, Select, Space } from 'antd';
import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

const ConnectionDrawer: React.FC = () => {
  const state = useSnapshot(datasourceState);
  const [form] = Form.useForm<ConnectionType>();

  const isEdit = !!state.asyncCurrentConnection.data;

  useEffect(() => {
    if (state.open) {
      if (isEdit && state.asyncCurrentConnection.data) {
        // 编辑模式，填充表单数据
        form.setFieldsValue(state.asyncCurrentConnection.data as ConnectionType);
      } else {
        // 新增模式，重置表单
        form.resetFields();
      }
    }
  }, [state.open, state.asyncCurrentConnection.data, isEdit, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (isEdit && state.asyncCurrentConnection.data) {
        // 更新
        await editConnection(state.asyncCurrentConnection.data.id!, values);
        message.success('更新成功');
        closeModal();
      } else {
        // 新增
        await addConnection(values);
        message.success('添加成功');
        closeModal();
      }
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <Drawer
      title={isEdit ? '编辑数据库连接' : '新增数据库连接'}
      open={state.open}
      onClose={handleCancel}
      width={'100%'}
      placement="right"
      destroyOnHidden
      extra={
        <Space>
          <Button type="primary" onClick={handleOk}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label="连接标识符"
          name="key"
          rules={[
            { required: true, message: '请输入连接标识符' },
            { max: 50, message: '连接标识符不能超过50个字符' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: '连接标识符只能包含字母、数字、下划线和横线' },
          ]}
        >
          <Input placeholder="请输入唯一的连接标识符，如：mysql_prod_db" />
        </Form.Item>
        <Form.Item
          label="连接名称"
          name="name"
          rules={[
            { required: true, message: '请输入连接名称' },
            { max: 50, message: '连接名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入便于识别的连接名称，如：生产环境MySQL数据库" />
        </Form.Item>

        <Form.Item label="数据库类型" name="type">
          <Select placeholder="请选择数据库类型" allowClear options={DATABASE_TYPES} />
        </Form.Item>

        <Form.Item
          label="JDBC连接地址"
          name="url"
          rules={[
            { required: true, message: '请输入JDBC连接地址' },
            { max: 200, message: 'JDBC连接地址不能超过200个字符' },
          ]}
        >
          <Input placeholder="例如：jdbc:mysql://localhost:3306/mydatabase?useSSL=false&serverTimezone=UTC" />
        </Form.Item>

        <Form.Item
          label="数据库用户名"
          name="username"
          rules={[
            { required: true, message: '请输入数据库用户名' },
            { max: 50, message: '数据库用户名不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入数据库登录用户名" />
        </Form.Item>

        <Form.Item
          label="数据库密码"
          name="password"
          rules={[
            { required: true, message: '请输入数据库密码' },
            { max: 100, message: '数据库密码不能超过100个字符' },
          ]}
        >
          <Input.Password placeholder="请输入数据库登录密码" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ConnectionDrawer;
