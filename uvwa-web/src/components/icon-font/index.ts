import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  // Umi 会将 public 目录下的静态资源映射到站点根路径下
  // 因此这里使用根路径引用即可在开发与构建后保持一致
  scriptUrl: '/iconfont.js',
});

export default IconFont;