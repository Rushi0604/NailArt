import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative base path for GitHub Pages subfolder compatibility
  build: {
    outDir: 'dist',
  },
});
