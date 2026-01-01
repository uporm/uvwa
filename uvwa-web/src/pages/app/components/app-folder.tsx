import { createFolder, deleteFolder, listFolders, moveFolder, renameFolder } from '@/api/folder.api';
import EditableTree, { type EditableTreeRef } from '@/components/editable-tree';
import AppModal from '@/pages/app/components/app-modal';
import { appState, fetchApps, saveApp, setEditApp } from '@/stores/app.store';
import { AppType } from '@/types/app.types';
import { FolderTypeEnum } from '@/types/sys.types';
import { ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, TreeDataNode } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import styles from './app-folder.module.less';

// 将后端返回的目录结构转换为 Antd TreeDataNode
const toTreeData = (nodes: any[]): TreeDataNode[] => {
  if (!nodes) return [];
  return nodes.map((n: any) => ({
    title: n.name,
    key: n.id,
    children: toTreeData(n.children || []),
  }));
};

const FolderTree: React.FC = () => {
  const snap = useSnapshot(appState);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);

  const treeRef = useRef<EditableTreeRef>(null);

  useEffect(() => {
    const loadFolders = async () => {
      const res = await listFolders(FolderTypeEnum.APP);
      const data = toTreeData(res.data || []);
      setTreeData(data);
    };
    loadFolders();
  }, []);

  const handleUpdateApp = async (values: AppType) => {
    saveApp(values);
  };

  return (
    <>
      <Card
        className={styles.noBorderCard}
        title="资源管理器"
        size="small"
        extra={<Button type="text" icon={<PlusOutlined />} onClick={() => treeRef.current?.createRootNode()} />}
      >
        <EditableTree
          ref={treeRef}
          value={treeData}
          expandAll
          onChange={(nodes) => setTreeData(nodes)}
          getMenuItems={(defaults) => [
            ...(defaults || []),
            { type: 'divider' },
            { label: '导入 DSL', key: 'import-dsl', icon: <ImportOutlined /> },
            { label: '导出 DSL', key: 'export-dsl', icon: <ExportOutlined /> },
          ]}
          onMenuClick={(key) => {
            console.log('onMenuClick, key: ', key);
          }}
          onCreate={async (parentId, name) => {
            const res = await createFolder(FolderTypeEnum.APP, {
              parentId: parentId ? String(parentId) : '0',
              name,
            });
            return res?.data as React.Key;
          }}
          onRename={async (id, name) => {
            await renameFolder(FolderTypeEnum.APP, String(id), name);
          }}
          onDelete={async (id) => {
            await deleteFolder(FolderTypeEnum.APP, String(id));
            fetchApps();
          }}
          onMove={async (id, parentId, seq) => {
            await moveFolder(FolderTypeEnum.APP, String(id), parentId ? String(parentId) : '0', seq);
          }}
          onSelect={(selectedKey) => {
            fetchApps({ folderId: String(selectedKey ?? '') });
          }}
        />
      </Card>

      {snap.editApp.open && (
        <AppModal
          folderTreeData={treeData || []}
          title={snap.editApp.title}
          visible={snap.editApp.open}
          values={snap.editApp.info as AppType}
          onClose={() => setEditApp({ open: false, operation: 'NEW' })}
          onOk={handleUpdateApp}
        />
      )}
    </>
  );
};

export default FolderTree;
