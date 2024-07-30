import commonjs from '@rollup/plugin-commonjs';
import noderesolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const config = [
  {
    input: ['src/index.ts'],
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    plugins: [noderesolve(), commonjs(), typescript()],
  },
  {
    input: ['src/index.ts'],
    output: {
      file: 'dist/index.es.js',
      format: 'es',
    },
    plugins: [commonjs(), typescript()],
  },
];

export default config;
