import config from './rollup.config'

config.dest = 'dist/vue-local-storage.es2015.js'
config.format = 'es'
config.plugins.pop()

delete config.moduleName

export default config
