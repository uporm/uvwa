import { getAvailableRules, getDefaultErrorMessage } from '@/pages/app/variables';
import { MinusCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Flex, Form, Input, List, Select, theme } from 'antd';
import React, { useMemo } from 'react';
import { RangeInput } from './RangeInput';

interface ValidationRuleItemProps {
  field: any;
  form: FormInstance;
  variableType?: string;
  onRemove: (index: number) => void;
}

export const ValidationRuleItem: React.FC<ValidationRuleItemProps> = ({ field, onRemove, form, variableType = 'string' }) => {
  const { token } = theme.useToken();
  const { key, name: ruleIndex, ...restField } = field;
  const availableRules = useMemo(() => getAvailableRules(variableType), [variableType]);
  const ruleType = Form.useWatch(['rules', ruleIndex, 'type'], form);

  const handleRuleValueChange = (value: string, index: number) => {
    const currentType = form.getFieldValue(['rules', index, 'type']);
    if (currentType) {
      const updatedMessage = getDefaultErrorMessage(currentType, value);
      form.setFieldValue(['rules', index, 'message'], updatedMessage);
    }
  };

  const handleRuleTypeChange = (value: string, index: number) => {
    form.setFieldValue(['rules', index, 'value'], '');
    const defaultMessage = getDefaultErrorMessage(value);
    form.setFieldValue(['rules', index, 'message'], defaultMessage);
  };

  const renderValueInput = () => {
    if (ruleType === 'required' || ruleType === 'email') {
      return null;
    }

    if (ruleType === 'length' || ruleType === 'size') {
      return (
        <Form.Item {...restField} name={[ruleIndex, 'value']} noStyle>
          <RangeInput style={{ width: '150px' }} onChange={(value) => handleRuleValueChange(value, ruleIndex)} />
        </Form.Item>
      );
    }

    return (
      <Form.Item {...restField} name={[ruleIndex, 'value']} noStyle>
        <Input
          placeholder="请输入值"
          className="input-width"
          onChange={(e) => handleRuleValueChange(e.target.value, ruleIndex)}
        />
      </Form.Item>
    );
  };

  return (
    <List.Item key={key} className="validation-list-item">
      <Flex gap={8} align="center" className="full-width">
        <Form.Item {...restField} name={[ruleIndex, 'type']} noStyle>
          <Select className="select-width" onChange={(value) => handleRuleTypeChange(value, ruleIndex)}>
            {availableRules.map((rule) => (
              <Select.Option key={rule.value} value={rule.value}>
                {rule.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {renderValueInput()}

        <Flex flex={1}>
          <Form.Item {...restField} name={[ruleIndex, 'message']} noStyle>
            <Input placeholder="请输入错误提示" className="full-width" />
          </Form.Item>
        </Flex>

        <Button
          type="text"
          icon={<MinusCircleOutlined style={{ color: token.colorPrimary }} />}
          size="small"
          onClick={() => onRemove(ruleIndex)}
        />
      </Flex>
    </List.Item>
  );
};
