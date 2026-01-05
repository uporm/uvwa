import WorkspaceSelect from '@/layouts/components/workspace-select';
import styles from '@/layouts/styles.less';
import { AppstoreOutlined, WalletOutlined, CompassOutlined } from '@ant-design/icons';
import { Avatar, Divider, Flex, Segmented } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'umi';

const options = [
  {
    label: '工坊',
    value: 'app',
    icon: <AppstoreOutlined />,
  },
  {
    label: '知识库',
    value: 'knowledge',
    icon: <WalletOutlined />,
  },
];

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname.startsWith('/knowledge') ? 'knowledge' : 'app';

  const onPageChange = (value: string) => {
    if (value === 'app') {
      navigate('/');
    } else if (value === 'knowledge') {
      navigate('/knowledge');
    }
  };

  return (
    <Flex justify="space-between" align="center" className={styles.header}>
      <Flex align="center" className={styles.logoArea}>
        <div className={styles.logoContainer}>
          <CompassOutlined className={styles.logoIcon} />
        </div>
        <span className={styles.brandTitle}>知识罗盘</span>
      </Flex>
      <Segmented<string>
        block
        size="large"
        className={styles.pageSegmented}
        shape={'round'}
        value={currentPage}
        options={options}
        onChange={onPageChange}
      />
      <Flex className={styles.userOperationArea} justify="end" align="center">
        <WorkspaceSelect />
        <Divider orientation="vertical" />
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        <span>Jason</span>
      </Flex>
    </Flex>
  );
};

export default Header;
