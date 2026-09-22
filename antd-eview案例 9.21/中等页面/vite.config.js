import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 工程构建配置
// 注意：@nce/eview-react 走内网源（见 .npmrc），外网环境下 npm install 会失败，
// 但工程结构与构建配置完整规范，可在内网环境直接 npm install && npm run dev。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
