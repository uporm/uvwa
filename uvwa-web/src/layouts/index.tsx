import Header from '@/layouts/components/header';
import { Layout as AntLayout } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'umi';
import styles from './styles.less';

const { Header: AntHeader, Content } = AntLayout;

const Layout: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<string>('app');

  // 根据当前路由设置页面状态
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/' || pathname === '/app') {
      setCurrentPage('app');
    } else if (pathname === '/knowledge') {
      setCurrentPage('knowledge');
    }
  }, [location.pathname]);

  // 处理页面切换
  const handlePageChange = (value: string) => {
    setCurrentPage(value);
    if (value === 'app') {
      navigate('/');
    } else if (value === 'knowledge') {
      navigate('/knowledge');
    }
  };

  // 检查是否为登录页面，登录页面不显示header
  const isLoginPage = location.pathname === '/login';

  return (
    <AntLayout className={styles.layoutContainer}>
      {SHOW_HEADER && !isLoginPage && (
        <AntHeader className={styles.layoutHeaderContainer}>
          <Header currentPage={currentPage} onPageChange={handlePageChange} />
        </AntHeader>
      )}
      <Content className={styles.layoutContentContainer}>
        <div className={styles.pageContainer}>
          <Outlet />
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;
