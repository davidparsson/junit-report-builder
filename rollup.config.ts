import commonjs from '@rollup/plugin-commonjs';
import noderesolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';


const config = [{
    input: ['src/index.ts'],
    output: {
        file: 'dist/index.js',
        name: 'junitReportBuilder',
        format: 'cjs',
    },
    treeshake: true,
    plugins: [
        noderesolve(),
        commonjs(),
        typescript()
    ]
}];

export default config;