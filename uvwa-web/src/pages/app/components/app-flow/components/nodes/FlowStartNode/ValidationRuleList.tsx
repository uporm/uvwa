import { getAvailableRules, getDefaultErrorMessage } from '@/pages/app/variables';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import React from 'react';
import { ValidationRuleItem } from './ValidationRuleItem';

// 校验规则列表组件
interface ValidationRuleListProps {
  form: any;
  variableType?: string;
}

export const ValidationRuleList: React.FC<ValidationRuleListProps> = ({ form, variableType = 'string' }) => {
  // 获取当前变量类型的默认校验规则
  const getDefaultRuleType = () => {
    const availableRules = getAvailableRules(variableType);
    return availableRules.length > 0 ? availableRules[0].value : 'required';
  };

  return (
    <Form.Item label="校验规则">
      <Form.List name="rules">
        {(fields, { add, remove }) => (
          <>
            {fields.length === 0 && <div className="empty-state">暂无校验规则</div>}

            {fields.map((field) => (
              <ValidationRuleItem key={field.key} field={field} onRemove={remove} form={form} variableType={variableType} />
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              className="full-width"
              size="small"
              onClick={() => {
                const defaultRuleType = getDefaultRuleType();
                const defaultMessage = getDefaultErrorMessage(defaultRuleType);
                add({ type: defaultRuleType, message: defaultMessage });
              }}
            >
              添加校验规则
            </Button>
          </>
        )}
      </Form.List>
    </Form.Item>
  );
};
