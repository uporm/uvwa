import FolderTree from '@/pages/app/components/app-folder';
import AppSearch from '@/pages/app/components/app-search';
import AppTable from '@/pages/app/components/app-table';
import { fetchApps, fetchTags } from '@/stores/app.store';
import { Flex, Splitter } from 'antd';
import React, { useEffect } from 'react';
import { AppTypeEnum } from '@/types/enum.types';

const FlowListPage: React.FC = () => {
  useEffect(() => {
    (async () => {
      await fetchTags();
      await fetchApps({ appType: AppTypeEnum.All });
    })();
  }, []);

  return (
    <>
      <Splitter style={{ height: '100%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Splitter.Panel collapsible defaultSize={'10%'} min="6%" style={{ backgroundColor: 'white' }}>
          <FolderTree />
        </Splitter.Panel>
        <Splitter.Panel>
          <Flex vertical gap={10} style={{ margin: '5px 10px 0px 10px' }}>
            <AppSearch />
            <AppTable />
          </Flex>
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default FlowListPage;
