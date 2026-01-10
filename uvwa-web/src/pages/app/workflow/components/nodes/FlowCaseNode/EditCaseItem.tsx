import IconFont from '@/components/icon-font';
import VariableAvailableSelect from '@/components/variable-available-select';
import { COMPARE_OPERATOR_TYPES } from '@/constants/app';
import { AvailableVariable } from '@/pages/app/variables';
import { Case } from '@/types/app.types';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Flex, Form, Input, Select, theme } from 'antd';
import { useEffect, useState } from 'react';
import styles from './styles.less';

const { useToken } = theme;

interface EditCaseItemProps {
  value: Case;
  title: string;
  variablesWithNode: AvailableVariable[];
  onDelete?: () => void;
  onChange: (value: Case) => void;
}

const EditCaseItem: React.FC<EditCaseItemProps> = ({ value, title, variablesWithNode, onDelete, onChange }) => {
  const { token } = useToken();
  const [form] = Form.useForm();
  const currentConditions = Form.useWatch('conditions', form);
  const [logicalOperator, setLogicalOperator] = useState<string>(value.opr || 'and');

  // 初始化表单数据
  useEffect(() => {
    form.setFieldsValue({
      conditions: value.conditions || [],
    });
  }, [value, form]);

  // 统一的更新Case函数
  const updateCase = (newConditions?: any[], newOperator?: string) => {
    const conditions = newConditions ?? form.getFieldValue('conditions') ?? [];
    const operator = newOperator ?? logicalOperator;

    const updatedCase: Case = {
      ...value,
      opr: operator,
      conditions,
    };
    onChange(updatedCase);
  };

  // 表单变化处理
  const handleFormChange = () => {
    updateCase();
  };

  // 逻辑操作符切换
  const toggleLogicalOperator = () => {
    const newOperator = logicalOperator === 'and' ? 'or' : 'and';

    setLogicalOperator(newOperator);
    updateCase(undefined, newOperator);
  };

  // 添加条件
  const addCondition = () => {
    const currentConditions = form.getFieldValue('conditions') || [];
    const newConditions = [
      ...currentConditions,
      {
        varId: undefined,
        opr: 'in',
        value: '',
      },
    ];

    form.setFieldsValue({ conditions: newConditions });
    updateCase(newConditions);
  };

  // 删除条件
  const removeCondition = (index: number) => {
    // 延迟执行以确保表单更新完成
    setTimeout(handleFormChange, 0);
  };

  // 渲染条件项
  const renderConditionItem = (field: any, remove: (name: number) => void) => {
    const { key, name, ...restField } = field;

    return (
      <Flex key={key} align="center" gap={5}>
        <Flex vertical gap={1} className={styles.conditionContainer}>
          {/* 变量选择和操作符 */}
          <Flex align="center" gap={0} justify="space-between">
            <Form.Item {...restField} name={[name, 'varId']} style={{ marginBottom: 0 }}>
              <VariableAvailableSelect
                variablesWithNode={variablesWithNode}
                variant="borderless"
                size="small"
                suffixIcon={null}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                }}
              />
            </Form.Item>
            <Form.Item {...restField} name={[name, 'opr']} style={{ marginBottom: 0 }}>
              <Select
                placeholder="操作符"
                variant="borderless"
                popupMatchSelectWidth={false}
                onChange={handleFormChange}
                size="small"
                options={COMPARE_OPERATOR_TYPES}
              />
            </Form.Item>
          </Flex>

          <Divider style={{ margin: '4px 0' }} />

          {/* 输入值 */}
          <Form.Item {...restField} name={[name, 'value']} style={{ margin: 0 }}>
            <Input placeholder="输入值" onChange={handleFormChange} className={styles.transparentInput} size="small" />
          </Form.Item>
        </Flex>

        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            remove(name);
            removeCondition(name);
          }}
        />
      </Flex>
    );
  };

  // 渲染逻辑操作符按钮
  const renderLogicalOperatorButton = () => {
    if (!currentConditions?.length) return null;

    return (
      <>
        <div className={styles.conditionsWrapperLine} style={{ borderColor: token.colorBorderSecondary }} />
        <div className={styles.conditionsWrapperBtn}>
          <Button
            size="small"
            type="dashed"
            icon={<IconFont type="icon-qiehuan" />}
            iconPosition="end"
            disabled={currentConditions.length <= 1}
            onClick={toggleLogicalOperator}
          >
            {logicalOperator.toUpperCase()}
          </Button>
        </div>
      </>
    );
  };

  // 渲染条件列表
  const renderConditionsList = () => (
    <Form.List name="conditions">
      {(fields, { remove }) => (
        <Flex vertical gap={5}>
          {fields.length === 0 ? (
            <span style={{ color: token.colorTextSecondary, fontStyle: 'italic' }}>暂无条件，点击 [+] 添加</span>
          ) : (
            fields.map((field) => renderConditionItem(field, remove))
          )}
        </Flex>
      )}
    </Form.List>
  );

  // 渲染卡片标题
  const renderCardTitle = () => (
    <Flex justify="space-between" align="center">
      <span style={{ fontWeight: 'bold' }}>{title}</span>
      <Flex gap={5} align="center">
        <Button type="text" size="small" icon={<PlusOutlined />} onClick={addCondition} />
        {onDelete && <Button type="text" icon={<DeleteOutlined />} size="small" onClick={onDelete} />}
      </Flex>
    </Flex>
  );

  return (
    <Card style={{ width: '100%', boxShadow: 'none' }} size="small" variant="borderless" title={renderCardTitle()}>
      <Form form={form} onValuesChange={handleFormChange}>
        <div className={styles.conditionsWrapper}>
          {renderLogicalOperatorButton()}
          {renderConditionsList()}
        </div>
      </Form>
    </Card>
  );
};

export default EditCaseItem;
