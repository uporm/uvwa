import VariableAvailableSelect from '@/components/variable-available-select';
import { getAvailableVariables } from '@/pages/app/variables';
import { flowContentState } from '@/stores/app-flow.store';
import { EdgeType, LoopNodeType, NodeType } from '@/types/app.types';
import { Card, Flex, Form, Input, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';

interface LoopNodeProps {
  node: NodeType<LoopNodeType>;
  onChange: (node: NodeType<LoopNodeType>) => void;
}

const options = [
  { value: 'for', label: '使用数组循环' },
  { value: 'while', label: '指定循环次数' },
  { value: 'forever', label: '无限循环' },
];

export default ({ node, onChange }: LoopNodeProps) => {
  const flowContentSnap = useSnapshot(flowContentState);
  const [form] = Form.useForm();
  const [loopType, setLoopType] = useState<string>('');

  // 初始化表单数据
  useEffect(() => {
    const initialValues = {
      type: node.data.type || '',
      forVarId: node.data.forVarId || undefined,
      whileNumber: node.data.whileNumber || 1,
      bodyVarName: node.data.bodyVarName || 'item',
      bodyIndexName: node.data.bodyIndexName || 'index',
    };

    form.setFieldsValue(initialValues);
    setLoopType(node.type || '');
  }, [node.data, form]);

  // 表单值变化处理
  const onValuesChange = (_: any, values: any) => {
    // 实时更新节点数据
    const updatedData = {
      ...node.data,
      ...values,
    };

    // 根据循环类型添加特定字段
    if (values.type === 'for') {
      updatedData.forVarId = values.forVarId;
      // 清除其他类型的字段
      delete updatedData.whileNumber;
    } else if (values.type === 'while') {
      updatedData.whileNumber = values.whileNumber;
      // 清除其他类型的字段
      delete updatedData.forVarId;
    } else if (values.type === 'forever') {
      // 清除其他类型的字段
      delete updatedData.forVarId;
      delete updatedData.whileNumber;
    }

    // 更新节点
    onChange({ ...node, data: updatedData });
  };

  // 获取可用变量列表
  const variablesWithNode = useMemo(() => {
    return getAvailableVariables(
      node.id,
      flowContentSnap.nodes as NodeType<LoopNodeType>[],
      flowContentSnap.edges as EdgeType<any>[],
    );
  }, [node.id, flowContentSnap.nodes, flowContentSnap.edges]);

  return (
    <>
      <Form form={form} onValuesChange={onValuesChange} layout="vertical">
        <Flex align="center" justify={'center'} vertical>
          {/* 循环配置 */}
          <Card title="循环变量" style={{ width: '100%', boxShadow: 'none' }} size="small" variant="borderless">
            <Form.Item name="type" label="循环类型" rules={[{ required: true, message: '请选择循环类型' }]}>
              <Select placeholder="请选择循环类型" options={options} onChange={(value) => setLoopType(value)} />
            </Form.Item>

            {/* 根据循环类型显示不同内容 */}
            {loopType === 'for' && (
              <Form.Item name="forVarId" label="循环变量" rules={[{ required: true, message: '请输入循环条件' }]}>
                <VariableAvailableSelect variablesWithNode={variablesWithNode} />
              </Form.Item>
            )}

            {loopType === 'while' && (
              <Form.Item name="whileNumber" label="循环次数" rules={[{ required: true, message: '请输入循环次数' }]}>
                <Input placeholder="请输入循环次数" type="number" />
              </Form.Item>
            )}
          </Card>

          {/* 循环体变量配置 */}
          <Card title="循环体变量" style={{ width: '100%', boxShadow: 'none' }} size="small" variant="borderless">
            <Form.Item name="bodyVarName" label="循环体变量名" rules={[{ required: true, message: '请输入循环体变量名' }]}>
              <Input placeholder="请输入循环体变量名" />
            </Form.Item>
            <Form.Item name="bodyIndexName" label="序号变量名" rules={[{ required: true, message: '请输入序号变量名' }]}>
              <Input placeholder="请输入序号变量名" />
            </Form.Item>
          </Card>
        </Flex>
      </Form>
    </>
  );
};
