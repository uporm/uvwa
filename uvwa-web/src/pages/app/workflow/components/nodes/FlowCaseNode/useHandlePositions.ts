import { Case } from '@/types/app.types';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseHandlePositionsProps {
  nodeId: string;
  cases?: Case[];
}

interface UseHandlePositionsReturn {
  handles: React.ReactElement[];
  setElementRef: (id: string, element: HTMLSpanElement | null) => void;
  getHandleIds: () => string[];
}

/**
 * 简化的 handle 位置管理 hook
 *
 * 核心思路：
 * 1. 为 IF、ELIF、ELSE 分配固定的 id
 * 2. 通过 id 对应元素的实际位置添加 Handle
 * 3. 简化逻辑，提高可读性和维护性
 */
export const useHandlePositions = ({ nodeId, cases }: UseHandlePositionsProps): UseHandlePositionsReturn => {
  const updateNodeInternals = useUpdateNodeInternals();
  const elementsRef = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [refreshKey, setRefreshKey] = useState(0);

  // 计算元素的 handle 位置
  const calculatePosition = useCallback((element: HTMLSpanElement): number => {
    return element.offsetTop + element.offsetHeight / 2 - 1;
  }, []);

  // 设置元素 ref 的回调函数
  const setElementRef = useCallback((id: string, element: HTMLSpanElement | null) => {
    if (element) {
      elementsRef.current.set(id, element);
      // 延迟触发重新计算，确保元素已经渲染完成
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
      }, 0);
    } else {
      elementsRef.current.delete(id);
      setRefreshKey((prev) => prev + 1);
    }
  }, []);

  // 获取所有 handle 的 id 列表
  const getHandleIds = useCallback((): string[] => {
    const ids: string[] = [];

    // 为每个 case 生成对应的 handle id
    if (cases) {
      cases.forEach((caseItem, index) => {
        // 使用固定的命名规则：if-{caseId}, elif-{caseId}
        const handleId = index === 0 ? `if-${caseItem.id}` : `elif-${caseItem.id}`;
        ids.push(handleId);
      });
    }

    // ELSE 的 handle id
    ids.push('else');

    return ids;
  }, [cases]);

  // 生成 handle 元素
  const handles = useMemo(() => {
    const handleElements: React.ReactElement[] = [];
    const handleIds = getHandleIds();

    handleIds.forEach((handleId) => {
      const element = elementsRef.current.get(handleId);
      if (element) {
        const position = calculatePosition(element);
        if (position > 0) {
          // 确定实际的 handle id（用于连接）
          let actualHandleId: string;
          if (handleId === 'else') {
            actualHandleId = nodeId; // ELSE 使用 nodeId
          } else {
            // IF/ELIF 使用对应的 case id
            actualHandleId = handleId.replace(/^(if|elif)-/, '');
          }

          handleElements.push(
            React.createElement(Handle, {
              key: handleId,
              type: 'source',
              position: Position.Right,
              id: actualHandleId,
              style: { top: position },
            }),
          );
        }
      }
    });

    return handleElements;
  }, [cases, nodeId, calculatePosition, getHandleIds, refreshKey]);

  // 监听变化并更新节点内部结构
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      updateNodeInternals(nodeId);
    });
    return () => cancelAnimationFrame(rafId);
  }, [nodeId, cases, updateNodeInternals]);

  return {
    handles,
    setElementRef,
    getHandleIds,
  };
};
