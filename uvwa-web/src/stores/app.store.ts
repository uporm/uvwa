import { cloneApp, createApp, deleteApp, listApps, updateApp, updateAppTag } from '@/api/app.api';
import { createTag, deleteTag, listTags, updateTag } from '@/api/tag.api';
import { App, CreateAppReq, ListAppReq } from '@/types/app.types';
import { WorkspaceTag } from '@/types/workspace.types';
import { AsyncState, createAsyncState, runAsync } from '@/utils/async-state';
import { proxy } from 'valtio';
import { TagTypeEnum } from '@/types/enum.types';

type Operation = 'NEW' | 'EDIT' | 'CLONE';
interface EditAppParams {
  open: boolean;
  title?: string;
  operation: Operation;
  info?: App;
}

export interface AppState {
  apps: AsyncState<App[]>;
  tags: AsyncState<WorkspaceTag[]>;
  editApp: EditAppParams;
  loading: AsyncState<void>;
  listAppReq: ListAppReq;
}

export const appState = proxy<AppState>({
  // 应用列表
  apps: createAsyncState(),
  // 标签
  tags: createAsyncState(),
  editApp: { open: false, operation: 'NEW' },
  loading: createAsyncState(),
  listAppReq: {},
});

// 获取标签列表
export const fetchTags = async () => {
  await runAsync(appState.tags, listTags, TagTypeEnum.APP);
};

export const addTag = async (tag: WorkspaceTag) => {
  await createTag(TagTypeEnum.APP, tag);
  await fetchTags();
};


export const setEditApp = (props: EditAppParams) => {
  appState.editApp = props;
};

// 更新应用标签
export const editAppTag = async (appId: string, tagIds: string[]) => {
  const index = appState.apps.data!.findIndex((app) => app.id === appId);
  console.log('更新应用标签', index);
  if (index !== -1) {
    console.log('更新应用标签', appState.apps.data, appId, tagIds);
    appState.apps.data![index] = { ...appState.apps.data![index], tagIds };
  }
  await runAsync(appState.loading, updateAppTag, appId, tagIds);
};

// 获取应用列表
export const fetchApps = async (params?: Partial<ListAppReq>) => {
  // 如果传入了参数，合并更新到 queryParams
  if (params) {
    appState.listAppReq = { ...appState.listAppReq, ...params };
  }
  await runAsync(appState.apps, listApps, appState.listAppReq);
};


// 创建新应用
const addApp = async (data: App) => {
  let req: CreateAppReq = {
    folderId: data.folderId,
    appType: data.type,
    name: data.name,
    description: data.description,
  };
  await createApp(req);
  await fetchApps();
  appState.editApp.open = false;
};
// 更新应用
const editApp = async (data: App) => {
  await updateApp(data.id, data);
  await fetchApps();
  appState.editApp.open = false;
};

// 复制应用
const copyApp = async (data: App) => {
  await cloneApp(data.id, data);
  await fetchApps();
  appState.editApp.open = false;
};

// 删除应用
export const removeApp = async (id: string) => {
  await deleteApp(id);
  await fetchApps();
};

export const saveApp = (data: App) => {
  if (appState.editApp.operation === 'NEW') {
    addApp(data);
  } else if (appState.editApp.operation === 'EDIT') {
    editApp(data);
  } else if (appState.editApp.operation === 'CLONE') {
    copyApp(data);
  }
};


export const editTag = async (tag: WorkspaceTag) => {
  await updateTag(TagTypeEnum.APP, tag.id, tag.name);
  await fetchTags();
};

export const removeTag = async (tagId: string) => {
  await deleteTag(TagTypeEnum.APP, tagId);
  await fetchTags();
  await fetchApps();
};