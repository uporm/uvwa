import IconFont from '@/components/icon-font';
import VariableTypeSelect from '@/components/variable-type-select';
import { VARIABLE_TYPE_RULES_MAP, VARIABLE_TYPES } from '@/constants/app';
import { Variable } from '@/types/app.types';
import { newId } from '@/utils/id';
import { Form, Input, Modal } from 'antd';
import React from 'react';
import './styles.less';
import { ValidationRuleList } from './ValidationRuleList';

interface EditStartDialogProps {
  open: boolean;
  variable?: Variable;
  onUpdate?: (variable: Variable) => void;
  onCancel?: () => void;
}

// 渲染校验值输入组件
export default ({ open, variable = {} as Variable, onUpdate, onCancel }: EditStartDialogProps) => {
  const [form] = Form.useForm();
  const [currentVarType, setCurrentVarType] = React.useState<string>('STRING');

  // 确保表单在打开时重置并设置初始值
  React.useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(variable);
      setCurrentVarType(variable.type || 'STRING');
    }
  }, [open, variable, form]);

  // 监听变量类型变化，清理不兼容的校验规则
  const handleVariableTypeChange = (newType: string) => {
    setCurrentVarType(newType);
    const supportedRules = VARIABLE_TYPE_RULES_MAP[newType as keyof typeof VARIABLE_TYPE_RULES_MAP] || [];
    const currentRules = form.getFieldValue('rules') || [];
    const filteredRules = currentRules.filter((rule: any) => supportedRules.includes(rule?.type));
    form.setFieldValue('rules', filteredRules);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      delete values.type;
      values.type = currentVarType;
      if (!values.id) {
        values.id = newId();
      }
      onUpdate?.(values);
    });
  };

  return (
    <Modal
      width={700}
      title={
        <>
          <IconFont type="icon-variable" style={{ fontSize: 18 }} /> 编辑变量
        </>
      }
      open={open}
      onOk={handleOk}
      onCancel={() => onCancel?.()}
      okText="确定"
      cancelText="取消"
      className="edit-start-dialog"
    >
      <Form form={form} layout="vertical" initialValues={variable}>
        <Form.Item label="变量名称" name="name">
          <Input placeholder="请输入变量名称" />
        </Form.Item>

        <Form.Item label="变量类型" name="type">
          <VariableTypeSelect options={VARIABLE_TYPES} placeholder="请选择变量类型" onChange={handleVariableTypeChange} />
        </Form.Item>

        <ValidationRuleList form={form} variableType={currentVarType} />
      </Form>
    </Modal>
  );
};
