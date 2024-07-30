import commonjs from '@rollup/plugin-commonjs';
import noderesolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const plugins = [
    noderesolve(),
    commonjs(),
    typescript()
];

const config = [{
    input: ['src/index.ts'],
    output: {
        file: 'dist/index.js',
        format: 'cjs',
    },
    plugins
}, {
    input: ['src/index.ts'],
    output: {
        file: 'dist/index.es.js',
        format: 'es',
    },
    plugins
}];

export default config;