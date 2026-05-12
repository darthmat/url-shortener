// @ts-check

import { resolve } from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

/**
 * @param {string} projectDir
 */
export function config(projectDir) {
  return defineConfig({
    resolve: {
      alias: {
        '@': resolve(projectDir, './src'),
      },
    },
    test: {
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      coverage: {
        reporter: ['text'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/__utils__*',
          '**/__utils__/**',
          '**/*.d.ts',
          '**/migrations/**',
        ],
      },
      exclude: [...configDefaults.exclude, '**/dist/**', '__utils__/**'],
      reporters: 'verbose',
      passWithNoTests: true,
      root: projectDir,
      watch: false,
      testTimeout: 60_000,
      hookTimeout: 60_000,
    },
  });
}

export default config(import.meta.dirname);
