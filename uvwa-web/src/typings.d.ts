declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}


// 环境变量
declare const SHOW_HEADER: boolean;