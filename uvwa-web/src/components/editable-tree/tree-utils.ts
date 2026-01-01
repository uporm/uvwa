import { TreeDataNode } from 'antd';
import React from 'react';

// ==================== 树操作工具函数 ====================
export const treeUtils = {
  /**
   * 查找节点标题
   */
  findTitle: (nodes: TreeDataNode[], key: React.Key): string | undefined => {
    for (const node of nodes) {
      if (node.key === key) {
        return typeof node.title === 'string' ? node.title : undefined;
      }
      if (node.children) {
        const result = treeUtils.findTitle(node.children as TreeDataNode[], key);
        if (result !== undefined) return result;
      }
    }
    return undefined;
  },

  /**
   * 更新节点信息
   */
  updateNode: (nodes: TreeDataNode[], matchKey: React.Key, patch: { key?: React.Key; title?: string }): TreeDataNode[] => {
    return nodes.map((node) => {
      const isMatch = node.key === matchKey;
      const next: TreeDataNode = {
        ...node,
        key: isMatch && patch.key !== undefined ? patch.key : node.key,
        title: isMatch && patch.title !== undefined ? patch.title : node.title,
      };
      if (node.children) {
        next.children = treeUtils.updateNode(node.children as TreeDataNode[], matchKey, patch);
      }
      return next;
    });
  },

  /**
   * 添加子节点
   */
  addChild: (nodes: TreeDataNode[], parentKey: React.Key, child: TreeDataNode): TreeDataNode[] => {
    return nodes.map((node) => {
      if (node.key === parentKey) {
        const currentChildren = (node.children as TreeDataNode[]) || [];
        return {
          ...node,
          children: [...currentChildren, child],
        };
      }

      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: treeUtils.addChild(node.children as TreeDataNode[], parentKey, child),
        };
      }

      return node;
    });
  },

  /**
   * 删除节点
   */
  removeNode: (nodes: TreeDataNode[], key?: React.Key): TreeDataNode[] => {
    return nodes
      .filter((node) => node.key !== key)
      .map((node) => ({
        ...node,
        children: node.children ? treeUtils.removeNode(node.children as TreeDataNode[], key) : undefined,
      }));
  },

  getAllNodeKeys: (nodes: TreeDataNode[]) => {
    const keys: React.Key[] = [];
    const traverse = (nodes: TreeDataNode[]) => {
      nodes.forEach((node) => {
        keys.push(node.key);
        if (node.children) traverse(node.children as TreeDataNode[]);
      });
    };
    traverse(nodes);
    return keys;
  },
};
