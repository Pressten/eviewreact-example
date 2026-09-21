import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// eview-react 工程接入：plugin-react 提供 JSX 运行时；eview-react 组件 CSS 在 src/main.jsx 统一引入。
// 可选按需引入：npm i -D vite-plugin-eview-react 后在 plugins 追加 eviewReact()（此处未启用以降低 install 风险）。
// 产物仅用相对路径 import，未使用 @ 别名，故不配置 resolve.alias。
export default defineConfig({
  plugins: [react()],
});
