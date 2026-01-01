import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';

export interface EditFormProps {
  disabled?: boolean;
  initialValue: string;
  onConfirm: (value: string) => Promise<void>;
  onCancel: () => void;
}

const EditInput: React.FC<EditFormProps> = ({ disabled, initialValue, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  if (disabled) {
    return <span>{initialValue}</span>;
  }
  return (
    <Form
      initialValues={{ name: initialValue }}
      onFinish={async ({ name }) => {
        const value = String(name ?? '').trim();
        if (!value) {
          message.warning('名称不能为空');
          return;
        }
        setLoading(true);
        await onConfirm(value);
        setLoading(false);
      }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
    >
      <Form.Item name="name" style={{ margin: 0 }}>
        <Input size="small" autoFocus suffix={loading ? <LoadingOutlined /> : undefined} />
      </Form.Item>
      <Button size="small" type="text" htmlType="submit" icon={<CheckOutlined />} />
      <Button
        size="small"
        type="text"
        icon={<CloseOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
      />
    </Form>
  );
};

export default EditInput;
