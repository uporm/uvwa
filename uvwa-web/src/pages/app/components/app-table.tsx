import IconFont from '@/components/icon-font';
import AppFlow from '@/pages/app/components/app-flow';
import styles from '@/pages/app/styles.less';
import { appState, editAppTag, removeApp, setEditApp } from '@/stores/app.store';
import { AppType, AppTypeEnum } from '@/types/app.types';
import { CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Flex, message, Modal, Select, Spin, Tag, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useSnapshot } from 'valtio';

const { useToken } = theme;

const { Text, Paragraph } = Typography;

const getAppIcon = (type: AppTypeEnum) => {
  switch (type) {
    case AppTypeEnum.FLOW:
      return 'icon-flow';
    case AppTypeEnum.CHAT:
      return 'icon-chat';
    case AppTypeEnum.AUTONOMOUS:
      return 'icon-agent';
    default:
      return 'icon-flow';
  }
};

const AppTable: React.FC = () => {
  const appSnap = useSnapshot(appState);
  const { token } = useToken();
  const [flow, setFlow] = useState({ open: false, app: {} as AppType });

  const handleOpenApp = useCallback((app: AppType) => {
    setFlow({ open: true, app });
  }, []);

  const handleTagsChange = useCallback(
    async (appId: string, tags: string[]) => {
      await editAppTag(appId, tags);
      message.success('更新标签成功');
    },
    [editAppTag],
  );

  const handleDeleteApp = useCallback(
    (app: AppType) => {
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除应用 "${app.name}" 吗？此操作不可恢复。`,
        okText: '删除',
        cancelText: '取消',
        onOk: async () => {
          await removeApp(app.id);
        },
      });
    },
    [removeApp],
  );

  const getDropdownItems = (app: AppType) => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () =>
        setEditApp({
          open: true,
          operation: 'EDIT',
          title: '编辑应用',
          info: app,
        }),
    },
    {
      key: 'clone',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: () =>
        setEditApp({ open: true, title: '复制应用', operation: 'CLONE', info: { ...app, name: app.name + '(副本)' } }),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteApp(app),
    },
  ];

  return (
    <Spin spinning={appSnap.apps.loading}>
      <Flex gap={10} wrap>
        {appSnap.apps.data?.map((app) => (
          <Card
            key={app.id}
            hoverable
            style={{ width: '350px' }}
            styles={{ body: { padding: '10px 10px 1px 10px', height: '100%' } }}
          >
            <Flex vertical onClick={() => handleOpenApp(app as AppType)}>
              <Flex align="center" gap={6}>
                <IconFont type={getAppIcon(app.type)} style={{ color: token.colorPrimary, fontSize: '36px' }} />
                <Flex vertical gap={2}>
                  <Text style={{ fontSize: '14px' }}>{app.name}</Text>
                  <Text style={{ fontSize: '12px' }} type="secondary">
                    编辑于 {dayjs(app.updatedTime).format('YYYY-MM-DD HH:mm')}
                  </Text>
                </Flex>
              </Flex>
              <Paragraph type="secondary" ellipsis={{ rows: 2, tooltip: true }} style={{ marginTop: '16px', minHeight: '44px' }}>
                {app.description || '暂无描述'}
              </Paragraph>
            </Flex>
            <Flex justify="space-between" align={'center'}>
              <Select
                mode="multiple"
                maxTagCount="responsive"
                tagRender={(props) => (
                  <Tag icon={<TagOutlined />} closable={false}>
                    {props.label}
                  </Tag>
                )}
                style={{ flex: 1 }}
                suffixIcon={null}
                value={app.tagIds || []}
                onChange={(tagIds) => handleTagsChange(app.id, [...tagIds])}
                placeholder={
                  <Tag style={{ borderStyle: 'dashed' }}>
                    <TagOutlined style={{ marginRight: '4px' }} />
                    添加标签
                  </Tag>
                }
                className={styles.tagSelect}
                options={
                  appSnap.tags.data?.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  })) || []
                }
              />

              <Dropdown trigger={['click']} placement="bottomRight" menu={{ items: getDropdownItems(app as AppType) }}>
                <Button style={{ flexShrink: 0 }} type="text" icon={<EllipsisOutlined />} />
              </Dropdown>
            </Flex>
          </Card>
        ))}
      </Flex>
      <AppFlow app={flow.app} open={flow.open} onClose={() => setFlow({ open: false, app: {} as AppType })} />
    </Spin>
  );
};

export default AppTable;
