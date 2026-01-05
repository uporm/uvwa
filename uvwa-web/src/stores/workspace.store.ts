import { createWorkspace, getWorkspaces, setCurrentWorkspace } from '@/api/workspace.api'; // 工作空间状态管理
import { AsyncState, createAsyncState, runAsync } from '@/utils/async-state';
import { proxy } from 'valtio'; // 工作空间状态管理

// 工作空间状态管理
interface WorkspaceState {
  asyncWorkspaces: AsyncState<WorkspaceType[]>;
  currWorkspaceId: string | null;
}

export const workspaceState = proxy<WorkspaceState>({
  asyncWorkspaces: createAsyncState(),
  currWorkspaceId: null,
});


// 获取工作空间列表
export const fetchWorkspaces = async () => {
  const res = await runAsync(workspaceState.asyncWorkspaces, getWorkspaces);
  if (res) {
    const current = res.find((w) => w.selected);
    if (current) {
      workspaceState.currWorkspaceId = current.id;
    }
  }
};

// 切换工作空间
export const switchWorkspace = async (workspaceId: string) => {
  await setCurrentWorkspace(workspaceId);
  workspaceState.currWorkspaceId = workspaceId;
  // 刷新列表以更新 selected 状态
  await fetchWorkspaces();
};

// 初始化工作空间状态
export const initWorkspace = async () => {
  // 获取最新的工作空间列表
  await fetchWorkspaces();
};

// 创建并设置默认工作空间
export const createAndSetDefaultWorkspace = async (name: string, description?: string) => {
  const res = await createWorkspace({ name, description });
  if (res.data) {
    // 刷新工作空间列表
    await fetchWorkspaces();
    // 切换到新创建的工作空间
    await switchWorkspace(res.data.id);
  }
};