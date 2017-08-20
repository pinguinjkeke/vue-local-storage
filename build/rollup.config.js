import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import eslint from 'rollup-plugin-eslint'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'

const version = require('../package.json').version

export default {
  entry: 'src/index.js',
  dest: 'dist/vue-local-storage.js',
  format: 'umd',
  moduleName: 'VueLocalStorage',
  plugins: [
    replace({ __VERSION__: version }),
    nodeResolve(),
    eslint(),
    commonjs(),
    buble()
  ],
  banner:
`/**
 * vue-local-storage v${version}
 * (c) ${new Date().getFullYear()} Alexander Avakov
 * @license MIT
 */`
}
