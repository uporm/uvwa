import routes from './routes';
export default {
  define: {
    SHOW_HEADER: process.env.SHOW_HEADER !== 'false',
    COLOR_PRIMARY: process.env.COLOR_PRIMARY,
  },
  antd: {
    theme: {
      token: {
        colorPrimary: '#34AFBE',
      },
    },
  },
  routes: routes,
  npmClient: 'yarn',
  // UmiJS 默认启用 mock，可通过 MOCK=none 环境变量关闭
  mock: {
    exclude: [],
  },
  // 当 mock 关闭时使用的代理配置
  proxy: {
    '/uvwa/api': {
      target: 'http://localhost:8080', //测试环境
      changeOrigin: true,
      // pathRewrite: { '^/uvwa/api': '/' },
      onProxyReq: (proxyReq: any) => {
        proxyReq.setHeader('x-tenant-id', 1);
        proxyReq.setHeader('x-user-id', 0);
      },
    },
  },
};
