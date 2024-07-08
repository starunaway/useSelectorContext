import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        'use-selector-context': resolve(process.cwd(), '../packages/use-selector-context/src'),
      },
      extensions: ['.tsx', '.ts', '.json', '.jsx', '.js'],
    },
  };
});
