/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    isolate: false,
  },
});
