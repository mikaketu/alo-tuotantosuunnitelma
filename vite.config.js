import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Two pages, no server: the tool (index.html) and the rules page (saannot.html).
// `base: './'` keeps the build deployable under any path (a subfolder, GitHub Pages).
export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: { index: resolve(__dirname, 'index.html'), saannot: resolve(__dirname, 'saannot.html') },
    },
  },
});
