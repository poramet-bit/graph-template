import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ai': path.resolve(__dirname, '../../modules/ai_layer/src'),
      '@templates': path.resolve(__dirname, '../../templates')
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
