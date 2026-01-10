import MonacoEditor from '@/components/monaco-editor';
import VariableAvailableSelect from '@/components/variable-available-select';
import VariableTypeSelect from '@/components/variable-type-select';
import { VARIABLE_TYPES } from '@/constants/app';
import { getAvailableVariables } from '@/pages/app/variables';
import { flowSpecState } from '@/stores/app-flow.store';
import { CodeNode, FlowEdge, FlowNode, SqlNode } from '@/types/app.types';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Flex, Form, Input, List, Select, theme } from 'antd';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import styles from './styles.less';

const { useToken } = theme;

interface CodeNodeProps {
  node: FlowNode<CodeNode>;
  onChange: (node: FlowNode<CodeNode>) => void;
}

export default ({ node, onChange }: CodeNodeProps) => {
  const flowContentSnap = useSnapshot(flowSpecState);
  const { token } = useToken();
  const [form] = Form.useForm();

  // 监听 language 字段的变化
  const language = Form.useWatch('language', form) || 'javascript';

  // 初始化表单数据
  useEffect(() => {
    const initialValues = {
      input: node.data.input || [],
      language: node.data.language || 'javascript',
      content: node.data.content || '',
      output: node.data.output || [],
    };

    form.setFieldsValue(initialValues);
  }, [node.data, form]);

  // 表单值变化处理
  const onValuesChange = (changedValues: any, allValues: any) => {
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
      flowContentSnap.nodes as FlowNode<SqlNode>[],
      flowContentSnap.edges as FlowEdge<any>[],
    );
  }, [node.id, flowContentSnap.nodes, flowContentSnap.edges]);

  return (
    <Form form={form} onValuesChange={onValuesChange} layout="vertical">
      <Flex className={styles.codeContainer}>
        {/* 输入变量 */}
        <Form.List name="input">
          {(fields, { add, remove }) => (
            <Card
              title="输入变量"
              className={styles.codeCard}
              size="small"
              variant="borderless"
              extra={
                <Button type="text" icon={<PlusOutlined />} size="small" onClick={() => add({ name: '', value: undefined })} />
              }
            >
              {fields.length > 0 ? (
                <List
                  size="small"
                  bordered={false}
                  split={false}
                  dataSource={fields}
                  renderItem={(field) => (
                    <List.Item key={field.name} className={styles.codeVariableItem}>
                      <Flex className={styles.codeInputRow}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          className={`${styles.codeField} ${styles.codeFieldName}`}
                        >
                          <Input placeholder="变量名" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'value']}
                          className={`${styles.codeField} ${styles.codeFieldValue}`}
                        >
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
                <div className={styles.codeEmptyState}>暂无输入变量，点击右上角按钮添加</div>
              )}
            </Card>
          )}
        </Form.List>

        {/* 脚本编辑框 */}
        <div
          className={styles.codeEditorContainer}
          style={{
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadius,
          }}
        >
          {/* 语言选择 */}
          <Flex className={styles.codeLanguageBox}>
            <Form.Item name="language" className={styles.codeFieldLanguage}>
              <Select
                variant="borderless"
                size={'small'}
                className={styles.codeLanguageSelect}
                placeholder="请选择语言"
                options={[
                  { value: 'javascript', label: 'JavaScript' },
                  { value: 'python', label: 'Python' },
                ]}
              />
            </Form.Item>
          </Flex>
          <Divider className={styles.codeDivider} />

          {/* 代码编辑器 */}
          <Form.Item name="content" className={styles.codeFieldContent}>
            <MonacoEditor language={language} placeholder="请输入脚本代码..." height={400} />
          </Form.Item>
        </div>

        {/* 输出变量 */}
        <Form.List name="output">
          {(fields, { add, remove }) => (
            <Card
              title="输出变量"
              className={styles.codeCard}
              size="small"
              variant="borderless"
              extra={
                <Button type="text" icon={<PlusOutlined />} size="small" onClick={() => add({ name: '', type: 'string' })} />
              }
            >
              {fields.length > 0 ? (
                <List
                  size="small"
                  bordered={false}
                  split={false}
                  dataSource={fields}
                  renderItem={(field) => (
                    <List.Item key={field.key} className={`${styles.codeVariableItem} ${styles.codeVariableItemOutput}`}>
                      <Flex className={styles.codeInputRow}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          className={`${styles.codeField} ${styles.codeFieldOutputName}`}
                        >
                          <Input placeholder="变量名" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'type']}
                          className={`${styles.codeField} ${styles.codeFieldOutputType}`}
                        >
                          <VariableTypeSelect options={VARIABLE_TYPES} basic={true} placeholder="请选择变量类型" />
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
            </Card>
          )}
        </Form.List>
      </Flex>
    </Form>
  );
};
