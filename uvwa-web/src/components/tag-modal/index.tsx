import { TagType } from '@/types/sys.types';
import { PlusOutlined } from '@ant-design/icons';
import { Input, InputRef, message, Modal, Space, Tag, Tooltip } from 'antd';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.less';

interface TagModalProps {
  open: boolean;
  tags: TagType[];
  onCancel: () => void;
  onAdd?: (tag: TagType) => void;
  onUpdate?: (tag: TagType) => void;
  onDelete?: (tag: TagType) => void;
}

// Types
interface EditingTag {
  id: string;
  value: string;
}

const TagsModal: React.FC<TagModalProps> = ({ open, tags: initialTags, onCancel, onAdd, onUpdate, onDelete }) => {
  // State Management
  const [tags, setTags] = useState<TagType[]>(initialTags || []);
  const [isAdding, setIsAdding] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');
  const [editingTag, setEditingTag] = useState<EditingTag | null>(null);

  // Refs
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  // 聚焦逻辑
  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (editingTag) {
      editInputRef.current?.focus();
    }
  }, [editingTag]);

  // 重置模态框状态
  useEffect(() => {
    if (open) {
      setTags(initialTags || []);
      setIsAdding(false);
      setNewTagValue('');
      setEditingTag(null);
    }
  }, [open, initialTags]);

  // Utility Functions
  const validateTag = useCallback((tag: string, currentTags: TagType[], originalTag?: TagType): boolean => {
    const trimmedValue = tag.trim();

    if (!trimmedValue) return false;

    if (trimmedValue.length > 50) {
      message.warning('标签长度不能超过50个字符');
      return false;
    }

    // Check if tag already exists (excluding the original tag if editing)
    const isDuplicate = currentTags.some(
      (existingTag) => existingTag.name === trimmedValue && originalTag?.id !== existingTag.id,
    );

    if (isDuplicate) {
      message.warning('标签已存在');
      return false;
    }

    return true;
  }, []);

  // Tag Operations
  const removeTag = useCallback(
    (tagToRemove: TagType) => {
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagToRemove.id));
      if (onDelete) {
        onDelete(tagToRemove);
      }
    },
    [onDelete],
  );

  const startAddingTag = useCallback(() => {
    setIsAdding(true);
  }, []);

  const handleNewTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTagValue(e.target.value);
  }, []);

  const confirmNewTag = useCallback(() => {
    if (validateTag(newTagValue, tags)) {
      const trimmedValue = newTagValue.trim();
      const newTag = { id: nanoid(), name: trimmedValue } as TagType;
      setTags((prevTags) => [...prevTags, newTag]);
      if (onAdd) {
        onAdd(newTag);
      }
    }
    setIsAdding(false);
    setNewTagValue('');
  }, [newTagValue, tags, validateTag, onAdd]);

  const startEditingTag = useCallback((tag: TagType) => {
    setEditingTag({ id: tag.id, value: tag.name });
  }, []);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTag((prev) => (prev ? { ...prev, value: e.target.value } : null));
  }, []);

  const confirmEdit = useCallback(() => {
    if (!editingTag) return;

    const trimmedValue = editingTag.value.trim();
    const originalTag = tags.find((tag) => tag.id === editingTag.id);

    if (!trimmedValue) {
      // Remove tag if edited to empty
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== editingTag.id));
      if (originalTag && onDelete) {
        onDelete(originalTag);
      }
      setEditingTag(null);
      return;
    }

    if (validateTag(trimmedValue, tags, originalTag)) {
      const updatedTag = { ...originalTag!, name: trimmedValue } as TagType;
      setTags((prevTags) => prevTags.map((tag) => (tag.id === editingTag.id ? updatedTag : tag)));
      if (onUpdate) {
        onUpdate(updatedTag);
      }
    }
    setEditingTag(null);
  }, [editingTag, tags, validateTag, onUpdate]);

  // Tag Rendering
  const renderTag = useCallback(
    (tag: TagType) => {
      const isEditing = editingTag?.id === tag.id;
      const isLongTag = tag.name.length > 20;

      if (isEditing) {
        return (
          <Input
            ref={editInputRef}
            key={tag.id}
            size="small"
            className={styles.tagInput}
            value={editingTag?.value || ''}
            maxLength={50}
            onChange={handleEditChange}
            onBlur={confirmEdit}
            onPressEnter={confirmEdit}
          />
        );
      }

      const tagContent = (
        <Tag key={tag.id} closable className={styles.tagItem} onClose={() => removeTag(tag)}>
          <span
            className={styles.tagContent}
            onDoubleClick={(e) => {
              startEditingTag(tag);
              e.preventDefault();
            }}
          >
            {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
          </span>
        </Tag>
      );

      return isLongTag ? (
        <Tooltip title={tag.name} key={tag.id}>
          {tagContent}
        </Tooltip>
      ) : (
        tagContent
      );
    },
    [editingTag, handleEditChange, confirmEdit, removeTag, startEditingTag],
  );

  return (
    <Modal
      title="管理标签"
      open={open}
      onCancel={onCancel}
      footer={null}
      maskClosable
    >
      <Space size={[2, 6]} wrap className={styles.tagsContainer}>
        {tags.map(renderTag)}

        {isAdding ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            className={styles.tagInput}
            value={newTagValue}
            maxLength={50}
            allowClear
            onChange={handleNewTagChange}
            onBlur={confirmNewTag}
            onPressEnter={confirmNewTag}
            placeholder="输入标签名称"
          />
        ) : (
          <Tag className={styles.tagPlus} icon={<PlusOutlined />} onClick={startAddingTag}>
            新标签
          </Tag>
        )}
      </Space>
    </Modal>
  );
};

export default TagsModal;
