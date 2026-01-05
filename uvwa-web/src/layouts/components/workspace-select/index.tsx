import styles from '@/layouts/styles.less';
import { switchWorkspace, workspaceState } from '@/stores/workspace.store';
import { Workspace } from '@/types/workspace.types';
import { AliwangwangOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Select } from 'antd';
import React, { FC } from 'react';
import { useSnapshot } from 'valtio';

const WorkspaceSelect: FC = () => {
  const { asyncWorkspaces, currWorkspaceId } = useSnapshot(workspaceState);

  const handleWorkspaceChange = (workspaceId: string) => {
    switchWorkspace(workspaceId);
  };

  // 确保options中包含当前选中的工作空间，即使在数据加载期间
  const selectOptions = React.useMemo(() => {
    const options = asyncWorkspaces.data?.map((workspace: Workspace) => ({
      value: workspace.id,
      label: (
        <Flex gap={4}>
          <AliwangwangOutlined />
          {workspace.name}
        </Flex>
      ),
    }));

    return options;
  }, [asyncWorkspaces, currWorkspaceId]);

  return (
    <Select
      size="small"
      value={currWorkspaceId}
      loading={asyncWorkspaces.loading}
      popupMatchSelectWidth={200}
      styles={{ root: { border: 'none' } }}
      className={styles.workspace}
      onChange={handleWorkspaceChange}
      popupRender={(menu) => (
        <Flex vertical>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Button type="text" icon={<HomeOutlined />}>
            工作空间管理
          </Button>
        </Flex>
      )}
      options={selectOptions}
      placeholder="请选择工作空间"
    />
  );
};

export default WorkspaceSelect;
