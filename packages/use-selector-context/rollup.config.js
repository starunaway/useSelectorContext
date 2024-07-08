import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'useSelectorContext',
      globals: {
        react: 'React',
      },
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ declaration: true, outDir: 'dist', declarationDir: 'dist' }),
    terser(),
  ],
  external: ['react'],
};
