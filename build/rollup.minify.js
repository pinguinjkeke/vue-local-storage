import config from './rollup.config'
import uglify from 'rollup-plugin-uglify'

config.plugins.push(uglify())
config.dest = 'dist/vue-local-storage.min.js'

export default config
