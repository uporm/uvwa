import { createWorkspace, getWorkspaces, setCurrentWorkspace } from '@/api/workspace.api'; // 工作空间状态管理
import { Q, makeQ, run } from '@/utils/q';
import { proxy } from 'valtio';
import { Workspace } from '@/types/workspace.types'; // 工作空间状态管理

// 工作空间状态管理
interface WorkspaceState {
  workspaces: Q<Workspace[]>;
  currWorkspaceId: string | null;
}

export const workspaceState = proxy<WorkspaceState>({
  workspaces: makeQ(),
  currWorkspaceId: null,
});


// 获取工作空间列表
export const fetchWorkspaces = async () => {
  const res = await run(workspaceState.workspaces, getWorkspaces);
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