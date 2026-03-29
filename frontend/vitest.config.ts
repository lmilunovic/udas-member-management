import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'src/api/generated/**',
        'src/api/members.ts',
        'src/api/users.ts',
        'src/test/**',
        'src/main.tsx',
        'src/i18n.ts',
        'src/App.tsx',
        'src/components/ui/dropdown-menu.tsx',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/*.test.{ts,tsx}',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
