import IconFont from '@/components/icon-font';
import WorkspaceSelect from '@/layouts/components/workspace-select';
import styles from '@/layouts/styles.less';
import { AppstoreOutlined, WalletOutlined, CompassOutlined } from '@ant-design/icons';
import { Avatar, Divider, Flex, Segmented } from 'antd';
import React from 'react';

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

interface HeaderProps {
  currentPage: string;
  onPageChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
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
        <Divider type="vertical" />
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        <span>Jason</span>
      </Flex>
    </Flex>
  );
};

export default Header;
