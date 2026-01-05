/**
 * CaseNode组件 - 条件分支节点
 *
 * 性能优化特性：
 * 1. 使用React.memo包装主组件和子组件，避免不必要的重渲染
 * 2. 使用useMemo缓存复杂计算结果（handles、条件列表等）
 * 3. 使用useCallback优化回调函数，避免子组件重渲染
 * 4. 优化key生成策略，提升列表渲染性能
 * 5. 使用防抖机制优化DOM更新操作
 */

import { COMPARE_OPERATOR_TYPES } from '@/constants/app';
import { Handle, Position } from '@xyflow/react';
import { Flex, Space, theme } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import styles from './styles.less';

import IconFont from '@/components/icon-font';
import NodeWrapper from '@/pages/app/components/app-flow/components/node-wrapper';
import { getVariableInfoById } from '@/pages/app/variables';
import { flowContentState } from '@/stores/app-flow.store';
import { Case, CaseNode, FlowNode } from '@/types/app.types';
import { useSnapshot } from 'valtio';
import { useHandlePositions } from './useHandlePositions';

const { useToken } = theme;

export default memo((node: FlowNode<CaseNode>) => {
  // 使用自定义 hook 管理 handle 位置
  const { handles, setElementRef } = useHandlePositions({
    nodeId: node.id,
    cases: node.data.cases,
  });

  // 使用useMemo优化cases渲染
  const casesElements = useMemo(() => {
    if (!node.data.cases) return null;

    return node.data.cases.map((item: Case, index: number) => {
      // 使用固定的 id 命名规则
      const handleId = index === 0 ? `if-${item.id}` : `elif-${item.id}`;

      return (
        <CaseSection
          key={item.id}
          count={node.data.cases!.length}
          index={index}
          item={item}
          keywordRef={(el) => setElementRef(handleId, el)}
        />
      );
    });
  }, [node.data.cases, setElementRef]);

  // 使用useCallback优化else ref回调
  const elseRefCallback = useCallback(
    (el: HTMLSpanElement | null) => {
      setElementRef('else', el);
    },
    [setElementRef],
  );

  return (
    <NodeWrapper node={node}>
      <Flex vertical gap={5} className="node-container">
        <Flex vertical gap={10}>
          {casesElements}
        </Flex>
        <Flex justify={'end'}>
          <span className={styles.keyword} ref={elseRefCallback}>
            ELSE
          </span>
        </Flex>
        <Handle type="target" position={Position.Left} />
        {handles}
      </Flex>
    </NodeWrapper>
  );
});

// 优化的CasePart组件，使用React.memo避免不必要的重渲染
export const CaseSection = memo(
  ({
    count,
    index,
    item,
    keywordRef,
  }: {
    count: number;
    index: number;
    item: Case;
    keywordRef?: (el: HTMLSpanElement | null) => void;
  }) => {
    const { token } = useToken();
    const flowContentSnap = useSnapshot(flowContentState);

    // 使用useMemo优化case标题计算
    const caseTitle = useMemo(() => {
      return count > 1 ? `CASE ${index + 1}` : '';
    }, [count, index]);

    // 使用useCallback优化ref回调
    const optimizedKeywordRef = useCallback(
      (el: HTMLSpanElement | null) => {
        if (keywordRef) {
          keywordRef(el);
        }
      },
      [keywordRef],
    );

    // 使用useMemo优化关键字渲染
    const keywordElement = useMemo(() => {
      const keyword = index === 0 ? 'IF' : 'ELIF';
      return (
        <span className={styles.keyword} ref={optimizedKeywordRef}>
          {keyword}
        </span>
      );
    }, [index, optimizedKeywordRef]);

    // 使用useMemo优化逻辑操作符
    const logicalOperator = useMemo(() => {
      return (item.opr || 'and').toUpperCase();
    }, [item.opr]);

    // 使用useMemo优化条件列表渲染
    const conditionElements = useMemo(() => {
      return item.conditions.map((condition, condIndex) => {
        // 根据 varId 获取变量信息
        const variableInfo = getVariableInfoById(condition.varId, flowContentSnap.nodes as any[]);

        return (
          <Flex
            key={`${condition.varId}-${condition.opr}-${condition.value}-${condIndex}`}
            align="center"
            gap={15}
            className={styles.conditionItem}
          >
            {condIndex > 0 && (
              <span className={styles.logicalOpr} style={{ color: token.colorPrimary }}>
                {logicalOperator}
              </span>
            )}
            <Space size={3}>
              {variableInfo ? (
                <>
                  <IconFont type={variableInfo.nodeIcon} style={{ color: token.colorPrimary }} />
                  <span>{variableInfo.nodeName}</span>
                  <span style={{ color: token.colorText }}>/</span>
                  <IconFont type="icon-variable" style={{ color: token.colorPrimary }} />
                  <span style={{ color: token.colorPrimary }}>{variableInfo.varName}</span>
                </>
              ) : (
                <>
                  <IconFont type="icon-variable" style={{ color: token.colorPrimary }} />
                  <span style={{ color: token.colorPrimary }}>{condition.varId}</span>
                </>
              )}
              <span className={styles.compareOpr}>{COMPARE_OPERATOR_TYPES.find((op) => op.value === condition.opr)?.label}</span>
              <span>{condition.value}</span>
            </Space>
          </Flex>
        );
      });
    }, [item.conditions, logicalOperator, token.colorPrimary, flowContentSnap.nodes]);

    return (
      <Flex vertical gap={3}>
        <Flex justify={'space-between'} align={'center'}>
          <span>{caseTitle}</span>
          {keywordElement}
        </Flex>
        <Flex vertical gap={3}>
          {conditionElements}
        </Flex>
      </Flex>
    );
  },
);
