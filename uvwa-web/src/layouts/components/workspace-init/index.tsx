import { Button, Flex, Form, Input, message, Typography } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import styles from './styles.less';
import { createAndSetDefaultWorkspace } from '@/stores/workspace.store';

const WorkspaceInit: FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values: { name: string; description?: string }) => {
    setLoading(true);
    try {
      await createAndSetDefaultWorkspace(values.name, values.description);
      message.success('工作空间创建成功');
      window.location.href = '/app';
    } catch (error) {
      console.error(error);
      message.error('创建工作空间失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex className={styles.container} justify="center" align="center">
      <Flex vertical className={styles.content}>
        <Flex vertical align="center" className={styles.header}>
          <Typography.Title className={styles.title} level={2}>
            欢迎使用知识罗盘
          </Typography.Title>
          <Typography.Text className={styles.subtitle} type="secondary">
            检测到您尚未创建工作空间，请创建一个工作空间以开始使用
          </Typography.Text>
        </Flex>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
          initialValues={{
            name: '默认工作空间',
          }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入工作空间名称' }]}
          >
            <Input placeholder="例如：我的知识库" size="large" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea
              placeholder="请输入工作空间描述（可选）"
              rows={4}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ height: 48 }}
            >
              立即创建
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};

export default WorkspaceInit;
