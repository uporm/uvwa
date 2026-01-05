import Header from '@/layouts/components/header';
import WorkspaceInit from '@/layouts/components/workspace-init';
import { initWorkspace, workspaceState } from '@/stores/workspace.store';
import { Flex, Layout as AntLayout, Spin } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'umi';
import { useSnapshot } from 'valtio';
import styles from './styles.less';

const { Header: AntHeader, Content } = AntLayout;

const Layout: FC = () => {
  const location = useLocation();
  const { asyncWorkspaces } = useSnapshot(workspaceState);

  // 初始化工作空间
  useEffect(() => {
    initWorkspace();
  }, []);

  // 检查是否为登录页面
  const isLoginPage = location.pathname === '/login';

  // 处理加载状态
  if (!isLoginPage && (asyncWorkspaces.loading || !asyncWorkspaces.data)) {
    return (
      <Flex justify="center" align="center" style={{ height: '100vh', background: '#f0f2f5' }}>
        <Spin size="large" fullscreen={true} tip="正在加载工作空间..." />
      </Flex>
    );
  }

  // 如果没有工作空间，显示初始化页面
  if (!isLoginPage && asyncWorkspaces.data && asyncWorkspaces.data.length === 0) {
    return <WorkspaceInit />;
  }

  return (
    <AntLayout className={styles.layoutContainer}>
      {SHOW_HEADER && !isLoginPage && (
        <AntHeader className={styles.layoutHeaderContainer}>
          <Header />
        </AntHeader>
      )}
      <Content className={styles.layoutContentContainer}>
        <Flex className={styles.pageContainer}>
          <Outlet />
        </Flex>
      </Content>
    </AntLayout>
  );
};

export default Layout;
