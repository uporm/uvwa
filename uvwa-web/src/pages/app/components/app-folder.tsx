import { createFolder, deleteFolder, listFolders, moveFolder, renameFolder } from '@/api/folder.api';
import EditableTree from '@/components/editable-tree';
import AppModal from '@/pages/app/components/app-modal';
import { appState, fetchApps, saveApp, setEditApp } from '@/stores/app.store';
import { App } from '@/types/app.types';
import { ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { Card, TreeDataNode } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import styles from './app-folder.module.less';
import { FolderTypeEnum } from '@/types/enum.types';

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

  useEffect(() => {
    const loadFolders = async () => {
      const res = await listFolders(FolderTypeEnum.APP);
      const data = toTreeData(res.data || []);
      setTreeData(data);
    };
    loadFolders();
  }, []);

  const handleUpdateApp = async (values: App) => {
    saveApp(values);
  };

  return (
    <>
      <Card
        className={styles.noBorderCard}
        title="资源管理器"
        size="small"
      >
        <EditableTree
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
              parentId: parentId ? String(parentId) : '1',
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
            fetchApps({ folderId: String(selectedKey?? '')});
          }}
        />
      </Card>

      {snap.editApp.open && (
        <AppModal
          folderTreeData={treeData || []}
          title={snap.editApp.title}
          visible={snap.editApp.open}
          values={snap.editApp.info as App}
          onClose={() => setEditApp({ open: false, operation: 'NEW' })}
          onOk={handleUpdateApp}
        />
      )}
    </>
  );
};

export default FolderTree;
