// 数据库类型选项
import { VariableNode } from '@/types/app.types';
import { ObjectType } from '@/types/common.types';
import { AppTypeEnum } from '@/types/enum.types';

export const DATABASE_TYPES = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'Oracle', value: 'oracle' },
  { label: 'SQL Server', value: 'sqlserver' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'Redis', value: 'redis' },
];

export const COMPARE_OPERATOR_TYPES = [
  { value: 'in', label: '包含' },
  { value: 'not in', label: '不包含' },
  { value: '=', label: '等于' },
  { value: '>', label: '大于' },
  { value: '<', label: '小于' },
  { value: '>=', label: '大于等于' },
  { value: '<=', label: '小于等于' },
  { value: '!=', label: '不等于' },
  { value: 'start with', label: '开头为' },
  { value: 'end with', label: '结尾为' },
  { value: 'is empty', label: '为空' },
  { value: 'is not empty', label: '不为空' },
];

// 校验规则类型配置
export const VALIDATION_RULE_TYPES = [
  { value: 'required', label: '必填' },
  { value: 'max', label: '最大值' },
  { value: 'min', label: '最小值' },
  { value: 'length', label: '长度' },
  { value: 'enum', label: '枚举' },
  { value: 'size', label: '集合大小' },
  { value: 'email', label: '邮箱格式' },
  { value: 'pattern', label: '正则表达式' },
];

// 校验规则默认错误提示信息
export const VALIDATION_RULE_DEFAULT_MESSAGES: ObjectType<string> = {
  required: '此字段为必填项',
  max: '数值不能大于 {value}',
  min: '数值不能小于 {value}',
  length: '长度必须在 {min} 到 {max} 之间',
  enum: '值必须是以下选项之一：{options}',
  size: '集合大小必须在 {min} 到 {max} 之间',
  email: '请输入有效的邮箱地址',
  pattern: '格式不正确，请检查输入内容',
};

// 根据变量类型定义可用的校验规则
export const VARIABLE_TYPE_RULES_MAP = {
  STRING: ['required', 'length', 'enum', 'email', 'pattern'],
  INTEGER: ['required', 'max', 'min', 'enum'],
  LONG: ['required', 'max', 'min', 'enum'],
  DECIMAL: ['required', 'max', 'min', 'enum'],
  BOOLEAN: ['required'],
  OBJECT: ['required'],
  FILE_IMAGE: ['required'],
  FILE_VIDEO: ['required'],
  FILE_AUDIO: ['required'],
  FILE_DOC: ['required'],
  FILE_OTHER: ['required'],
  ARRAY: ['required', 'size', 'enum'],
  ARRAY_STRING: ['required', 'size', 'enum'],
  ARRAY_INTEGER: ['required', 'size', 'enum'],
  ARRAY_LONG: ['required', 'size', 'enum'],
  ARRAY_DECIMAL: ['required', 'size', 'enum'],
  ARRAY_BOOLEAN: ['required', 'size', 'enum'],
  ARRAY_OBJECT: ['required', 'size', 'enum'],
  ARRAY_FILE_IMAGE: ['required', 'size', 'enum'],
  ARRAY_FILE_VIDEO: ['required', 'size', 'enum'],
  ARRAY_FILE_AUDIO: ['required', 'size', 'enum'],
  ARRAY_FILE_DOC: ['required', 'size', 'enum'],
  ARRAY_FILE_OTHER: ['required', 'size', 'enum'],
};

/**
 * 变量类型标签树形结构
 */
export const VARIABLE_TYPES: VariableNode[] = [
  { label: 'String', value: 'STRING', tag: 'basic' },
  { label: 'Integer', value: 'INTEGER', tag: 'basic' },
  { label: 'Long', value: 'LONG', tag: 'basic' },
  { label: 'Decimal', value: 'DECIMAL', tag: 'basic' },
  { label: 'Boolean', value: 'BOOLEAN', tag: 'basic' },
  { label: 'Object', value: 'OBJECT', tag: 'basic' },
  {
    label: 'File',
    value: 'FILE',
    children: [
      { label: 'Doc', value: 'FILE_DOC' },
      { label: 'Image', value: 'FILE_IMAGE' },
      { label: 'Video', value: 'FILE_VIDEO' },
      { label: 'Audio', value: 'FILE_AUDIO' },
      { label: 'Other', value: 'FILE_OTHER' },
    ],
  },
  {
    label: 'Array',
    value: 'ARRAY',
    tag: 'basic',
    children: [
      { label: 'String', value: 'ARRAY_STRING', tag: 'basic' },
      { label: 'Integer', value: 'ARRAY_INTEGER', tag: 'basic' },
      { label: 'Long', value: 'ARRAY_LONG', tag: 'basic' },
      { label: 'Decimal', value: 'ARRAY_DECIMAL', tag: 'basic' },
      { label: 'Boolean', value: 'ARRAY_BOOLEAN', tag: 'basic' },
      { label: 'Object', value: 'ARRAY_OBJECT', tag: 'basic' },
      {
        label: 'File',
        value: 'FILE',
        children: [
          { label: 'Doc', value: 'ARRAY_FILE_DOC' },
          { label: 'Image', value: 'ARRAY_FILE_IMAGE' },
          { label: 'Video', value: 'ARRAY_FILE_VIDEO' },
          { label: 'Audio', value: 'ARRAY_FILE_AUDIO' },
          { label: 'Other', value: 'ARRAY_FILE_OTHER' },
        ],
      },
    ],
  },
];

export const APP_TYPES = [
  { label: '全部', value: AppTypeEnum.All },
  { label: '工作流', value: AppTypeEnum.FLOW },
  { label: '对话式', value: AppTypeEnum.CHAT },
  { label: '自主式', value: AppTypeEnum.AUTONOMOUS },
];
