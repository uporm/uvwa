import MonacoEditor from '@/components/monaco-editor';
import VariableAvailableSelect from '@/components/variable-available-select';
import { getAvailableVariables } from '@/pages/app/variables';
import { flowContentState } from '@/stores/app-flow.store';
import { EdgeType, EndNodeType, NodeType, SqlNodeType } from '@/types/app.types';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, List, Space, Switch, theme } from 'antd';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import styles from './styles.less';

const { useToken } = theme;

interface EndNodeProps {
  node: NodeType<EndNodeType>;
  onChange: (node: NodeType<EndNodeType>) => void;
}

export default ({ node, onChange }: EndNodeProps) => {
  const flowContentSnap = useSnapshot(flowContentState);
  const { token } = useToken();
  const [form] = Form.useForm();
  const isWrap = Form.useWatch(['output', 'isWrap'], form);
  const isText = Form.useWatch(['output', 'isText'], form);

  // 初始化表单数据
  useEffect(() => {
    const initialValues = {
      title: node.data.title || '',
      description: node.data.description || '',
      output: {
        vars: node.data.output?.vars || [],
        isWrap: node.data.output?.isWrap || false,
        rCode: node.data.output?.rCode || 0,
        rMessage: node.data.output?.rMessage || '',
        isText: node.data.output?.isText || false,
        isStream: node.data.output?.isStream || false,
        text: node.data.output?.text || '',
      },
    };

    form.setFieldsValue(initialValues);
  }, [node.data, form]);

  // 表单值变化处理
  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log('表单值变化:', changedValues, allValues);
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        ...allValues,
      },
    };

    onChange(updatedNode);
  };

  // 获取可用变量列表
  const variablesWithNode = useMemo(() => {
    return getAvailableVariables(
      node.id,
      flowContentSnap.nodes as NodeType<SqlNodeType>[],
      flowContentSnap.edges as EdgeType<any>[],
    );
  }, [node.id, flowContentSnap.nodes, flowContentSnap.edges]);

  return (
    <Form form={form} onValuesChange={onValuesChange} layout="vertical">
      <Card
        title={
          <Space align="start">
            <span>输出变量</span>
            <Form.Item name={['output', 'isWrap']} noStyle valuePropName="checked">
              <Switch checkedChildren="标准格式" unCheckedChildren="原始数据" />
            </Form.Item>
          </Space>
        }
        className={styles.codeCard}
        size="small"
        variant="borderless"
        style={{ position: 'relative' }}
      >
        <Form.List name={['output', 'vars']}>
          {(fields: any[], { add, remove }) => (
            <>
              <div style={{ position: 'absolute', top: '8px', right: '12px', zIndex: 1 }}>
                <Button type="text" icon={<PlusOutlined />} size="small" onClick={() => add()} />
              </div>
              {fields.length > 0 ? (
                <List
                  size="small"
                  bordered={false}
                  split={false}
                  dataSource={fields}
                  renderItem={(field) => (
                    <List.Item key={field.key} className={styles.codeVariableItem}>
                      <Flex className={styles.codeInputRow}>
                        <Form.Item name={[field.name, 'name']} className={`${styles.codeField} ${styles.codeFieldName}`}>
                          <Input placeholder="变量名" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'value']} className={`${styles.codeField} ${styles.codeFieldValue}`}>
                          <VariableAvailableSelect variablesWithNode={variablesWithNode} placeholder="选择变量值" />
                        </Form.Item>
                        <Button
                          type="text"
                          icon={<DeleteOutlined style={{ color: token.colorPrimary }} />}
                          size="small"
                          onClick={() => remove(field.name)}
                        />
                      </Flex>
                    </List.Item>
                  )}
                />
              ) : (
                <div className={styles.codeEmptyState}>暂无输出变量，点击右上角按钮添加</div>
              )}
            </>
          )}
        </Form.List>
      </Card>

      {/* 包装对象配置 */}
      {isWrap ? (
        <Card size="small" title="包装对象" variant={'borderless'} className={styles.codeWrapCard}>
          <Form.Item
            name={['output', 'rCode']}
            label="返回码"
            layout="horizontal"
            labelAlign="right"
            labelCol={{ span: 4 }}
            rules={[{ required: true, message: '请输入返回码' }]}
          >
            <Input placeholder="请输入返回码，如：0" type="number" />
          </Form.Item>
          <Form.Item
            name={['output', 'rMessage']}
            label="返回消息"
            layout="horizontal"
            labelAlign="right"
            labelCol={{ span: 4 }}
            rules={[{ required: true, message: '请输入返回消息' }]}
          >
            <Input placeholder="请输入返回消息，如：success" />
          </Form.Item>
        </Card>
      ) : null}

      <Card
        title="输出文本"
        className={styles.codeCard}
        size="small"
        variant="borderless"
        extra={
          <Form.Item name={['output', 'isText']} noStyle valuePropName={'checked'}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        }
      >
        <Form.Item name={['output', 'text']}>
          <div className={styles.textEditorContainer}>
            <MonacoEditor language="text" placeholder="请输入输出文本..." height={200} readOnly={!isText} />
          </div>
        </Form.Item>
        <Form.Item name={['output', 'isStream']} label="流式输出" layout={'horizontal'} labelAlign="right">
          <Switch disabled={!isText} />
        </Form.Item>
      </Card>
    </Form>
  );
};
