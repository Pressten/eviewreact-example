import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 5 + plugin-react 4 — 锁版本（eview-react 工程接入要求）
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
