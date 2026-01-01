import { VariableKind, VariableNode } from '@/types/app/nodes'; // 定义组件 Props 接口，简化对 Cascader 的依赖，避免复杂泛型带来的类型问题 // 定义组件 Props 接口，简化对 Cascader 的依赖，避免复杂泛型带来的类型问题 // 定义组件 Props 接口，简化对 Cascader 的依赖，避免复杂泛型带来的类型问题
import { Cascader, ConfigProvider } from 'antd';
import React, { useMemo } from 'react';
import { VARIABLE_TYPES } from '@/constants/app'; // 定义组件 Props 接口，简化对 Cascader 的依赖，避免复杂泛型带来的类型问题 // 定义组件 Props 接口，简化对 Cascader 的依赖，避免复杂泛型带来的类型问题

// 定义组件 Props 接口，简化对 Cascader 的依赖，避免复杂泛型带来的类型问题
interface VariableTypeSelectProps {
  basic?: boolean;
  options?: VariableNode[];
  value?: VariableKind;
  onChange?: (value: VariableKind, selectedOptions?: VariableNode[]) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  size?: 'large' | 'middle' | 'small';
  style?: React.CSSProperties;
  className?: string;
  showSearch?: boolean;
}

const VariableTypeSelect: React.FC<VariableTypeSelectProps> = (props) => {
  const { basic, options = VARIABLE_TYPES, value, onChange, ...restProps } = props;

  const filteredOptions = useMemo(() => {
    // 如果basic为空或false，返回全部节点
    if (!basic) {
      return options;
    }

    // 递归过滤树形结构，当basic为true时只保留tag为'basic'的节点
    const filterTreeByBasic = (nodes: VariableNode[]): VariableNode[] => {
      return nodes
        .filter((node) => {
          // 如果basic为true，只保留tag为'basic'的节点
          return !(basic && node.tag !== 'basic');
        })
        .map((node) => {
          // 如果节点有子节点，递归过滤子节点
          if (node.children && node.children.length > 0) {
            const filteredChildren = filterTreeByBasic(node.children);
            // 如果过滤后子节点为空，且当前节点没有value，则过滤掉当前节点
            if (filteredChildren.length === 0 && !node.value) {
              return null;
            }
            return {
              ...node,
              children: filteredChildren,
            };
          }
          return node;
        })
        .filter(Boolean) as VariableNode[];
    };

    return filterTreeByBasic(options);
  }, [basic, options]);

  // 自定义 Cascader 显示渲染函数
  const displayRender = (labels: string[]) => {
    if (!labels || labels.length === 0) return '';

    // 递归构建嵌套格式，统一处理所有层级
    const buildNestedLabel = (labelArray: string[]): string => {
      if (labelArray.length === 1) {
        return labelArray[0];
      }
      const [first, ...rest] = labelArray;
      return `${first}<${buildNestedLabel(rest)}>`;
    };

    return buildNestedLabel(labels);
  };

  // 将 VariableDataType 转换为 Cascader 路径数组（按 value）
  const convertValueToPath = (variableType?: VariableKind): string[] | undefined => {
    if (!variableType) return undefined;

    const findPath = (nodes: VariableNode[], target: VariableKind, currentPath: string[] = []): string[] | null => {
      for (const node of nodes) {
        const nextPath = node.value ? [...currentPath, node.value] : currentPath;
        if (node.value === target) {
          return nextPath;
        }
        if (node.children) {
          const result = findPath(node.children, target, nextPath);
          if (result) return result;
        }
      }
      return null;
    };

    return findPath(filteredOptions, variableType) || undefined;
  };

  // 将 Cascader 路径数组转换为 VariableDataType（取最后一个 value）
  const convertPathToValue = (path: string[]): VariableKind | undefined => {
    if (!path || path.length === 0) return undefined;
    const last = path[path.length - 1];
    return String(last) as VariableKind;
  };

  const cascaderValue = convertValueToPath(value);

  // 转换 onChange 回调以匹配父组件期望的格式
  const handleChange = (path: string[], selectedOptions?: VariableNode[]) => {
    const convertedValue = convertPathToValue(path);
    if (convertedValue) {
      onChange?.(convertedValue as VariableKind, selectedOptions);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Cascader: {
            dropdownHeight: 'auto',
          },
        },
      }}
    >
      <Cascader
        options={filteredOptions}
        value={cascaderValue as any}
        onChange={handleChange}
        displayRender={displayRender}
        showSearch
        {...restProps}
      />
    </ConfigProvider>
  );
};

export default VariableTypeSelect;
