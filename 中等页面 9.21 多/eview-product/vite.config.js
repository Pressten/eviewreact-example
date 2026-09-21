import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 5 + plugin-react 4（eview-react 工程接入硬约束，勿升版本）
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500
  }
});
