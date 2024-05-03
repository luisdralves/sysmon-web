import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ['CLIENT', 'SERVER'],
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src/client'),
    },
  },
});
