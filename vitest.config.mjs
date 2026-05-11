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
        '@': resolve(projectDir, './src')
      },
    },
    test: {
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      coverage: {
        reporter: ['lcov', 'text', 'cobertura'],
      },
      exclude: [...configDefaults.exclude, '**/dist/**'],
      reporters: 'verbose',
      passWithNoTests: true,
      root: projectDir,
      watch: false,
    },
  });
}

export default config(import.meta.dirname);