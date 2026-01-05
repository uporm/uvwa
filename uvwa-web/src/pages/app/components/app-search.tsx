import TagsModal from '@/components/tag-modal';
import { APP_TYPES } from '@/constants/app';
import { addTag, appState, editTag, fetchApps, removeTag, setEditApp } from '@/stores/app.store';
import { WorkspaceTag } from '@/types/workspace.types';
import { PlusOutlined, SearchOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Form, Input, Segmented, Select, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';

const { Search } = Input;

const AppSearch: React.FC = () => {
  const [form] = Form.useForm();
  const snap = useSnapshot(appState);
  const [tagOpen, setTagOpen] = useState(false);

  // 只保留真正有价值的 useMemo
  const tagOptions = useMemo(() => {
    if (!snap.tags.data) return [];
    return snap.tags.data.map((tag) => ({
      label: tag.name,
      value: tag.id,
    }));
  }, [snap.tags.data]);

  return (
    <Form form={form} initialValues={{ type: 0, tags: [], name: '' }} style={{ marginTop: 5 }}>
      <Flex justify="space-between">
        <Form.Item name="type" noStyle>
          <Segmented
            block
            style={{ width: '300px' }}
            shape={'round'}
            options={APP_TYPES}
            onChange={(value) => fetchApps({ appType: value })}
          />
        </Form.Item>
        <Space>
          <Form.Item name="tags" noStyle>
            <Select
              allowClear
              mode="tags"
              style={{ width: '200px' }}
              maxTagCount="responsive"
              placeholder="全部标签"
              loading={snap.tags.loading}
              options={tagOptions}
              onChange={(tags) => {
                const values = Array.isArray(tags) ? tags : [];
                fetchApps({ tagIds: values as string[] });
              }}
              popupRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Flex>
                    <Button type="text" style={{ width: '100%' }} icon={<TagOutlined />} onClick={() => setTagOpen(true)}>
                      管理标签
                    </Button>
                  </Flex>
                </>
              )}
            />
          </Form.Item>
          <Form.Item name="name" noStyle>
            <Input
              placeholder="名称"
              style={{ width: 200 }}
              allowClear
              suffix={<SearchOutlined />}
              onClear={() => {
                fetchApps({ name: undefined });
              }}
              onPressEnter={(e) => {
                const name = (e.target as HTMLInputElement).value.trim();
                fetchApps({ name: name || undefined });
              }}
            />
          </Form.Item>
          <Divider orientation="vertical" />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setEditApp({ open: true, operation: 'NEW', title: '新建应用' })}
          >
            新建应用
          </Button>
        </Space>
      </Flex>

      <TagsModal
        open={tagOpen}
        tags={(snap.tags.data as WorkspaceTag[]) || []}
        onCancel={() => setTagOpen(false)}
        onAdd={(tag) => {
          addTag(tag);
        }}
        onUpdate={(tag) => {
          editTag(tag);
        }}
        onDelete={(tag) => {
          removeTag(tag.id);
        }}
      />
    </Form>
  );
};

export default AppSearch;
