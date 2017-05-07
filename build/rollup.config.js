import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'

const version = require('../package.json').version

export default {
    entry: 'src/index.js',
    dest: 'dist/vue-local-storage.js',
    format: 'umd',
    moduleName: 'VeeValidate',
    plugins: [
        replace({ __VERSION__: version }),
        nodeResolve(),
        commonjs(),
        buble()
    ],
    banner: 
`/**
 * vee-validate v${version}
 * (c) ${new Date().getFullYear()} Abdelrahman Awad
 * @license MIT
 */`
};