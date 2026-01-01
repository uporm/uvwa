import { getCurrentWorkspace, getWorkspaces, setCurrentWorkspace } from '@/api/workspace.api'; // 工作空间状态管理
import { AsyncState, createAsyncState, runAsync } from '@/utils/async-state';
import { proxy } from 'valtio'; // 工作空间状态管理

// 工作空间状态管理
interface WorkspaceState {
  asyncWorkspaces: AsyncState<WorkspaceType[]>;
  currWorkspaceId: string | null;
}

export const workspaceState = proxy<WorkspaceState>({
  asyncWorkspaces: createAsyncState([]),
  currWorkspaceId: null,
});

// 初始化工作空间状态
export const initWorkspace = async () => {
  // 获取最新的工作空间列表
  await fetchWorkspaces();
  // 从服务端加载当前工作空间
  await loadCurrentWorkspace();
};

// 获取工作空间列表
export const fetchWorkspaces = async () => {
  await runAsync(workspaceState.asyncWorkspaces, getWorkspaces);
};

// 切换工作空间
export const switchWorkspace = async (workspaceId: string) => {
  await setCurrentWorkspace(workspaceId);
  workspaceState.currWorkspaceId = workspaceId;
};

// 从服务端获取当前工作空间
const loadCurrentWorkspace = async () => {
  const res = await getCurrentWorkspace();
  if (res.data) {
    workspaceState.currWorkspaceId = res.data;
  }
};
