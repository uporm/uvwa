import { APP_TYPES } from '@/constants/app';
import { AppType } from '@/types/app.types';
import { Form, Input, Modal, Select, TreeDataNode, TreeSelect } from 'antd';
import React, { useState } from 'react';

export interface AppModalProps {
  title?: string;
  folderTreeData: TreeDataNode[];
  values?: AppType;
  visible: boolean;
  onClose: () => void;
  onOk?: (values: AppType) => Promise<void>;
}

const AppModal: React.FC<AppModalProps> = ({ title, folderTreeData, values, visible, onClose, onOk }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onOk?.(values);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确定"
      cancelText="取消"
      styles={{ body: { padding: '20px' } }}
    >
      <Form form={form} layout="vertical" initialValues={values} requiredMark={false}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="folderId" label="所属目录" rules={[{ required: true, message: '请选择所属目录' }]} hidden={!!values?.id}>
          <TreeSelect treeDefaultExpandAll treeData={folderTreeData} fieldNames={{ value: 'key', label: 'title' }} />
        </Form.Item>
        <Form.Item name="type" label="应用类型" rules={[{ required: true, message: '请选择应用类型' }]} hidden={!!values?.id}>
          <Select placeholder="请选择应用类型" options={APP_TYPES.filter((item) => item.value !== 0)} />
        </Form.Item>
        <Form.Item
          name="name"
          label="应用名称"
          rules={[
            { required: true, message: '请输入应用名称' },
            { max: 50, message: '名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入应用名称" />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[{ max: 200, message: '描述不能超过200个字符' }]}>
          <Input.TextArea placeholder="应用描述（可选）" rows={3} showCount maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppModal;
