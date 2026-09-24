import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{js,mjs,jsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    environment: 'node',
    globals: false,
    reporters: 'default',
  },
});
