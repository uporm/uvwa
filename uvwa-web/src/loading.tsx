import { ConfigProvider, Flex, Spin } from 'antd';

export default () => {
  return (
    <ConfigProvider>
      <Flex 
        justify={'center'} 
        align="center" 
        style={{ 
          height: '100vh', 
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: '#fff',
          zIndex: 9999
        }}
      >
        <Spin 
          size={'large'} 
          style={{ 
            fontSize: '48px',
            transform: 'scale(1.5)'
          }} 
        />
      </Flex>
    </ConfigProvider>
  );
};
