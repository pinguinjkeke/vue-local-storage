import VueLocalStorage from './VueLocalStorage'

export default {
  /**
   * Install vue-local-storage plugin
   *
   * @param {Vue} Vue
   * @param {Object} options
   */
  install: (Vue, options = {}) => {
    if (typeof process !== 'undefined' &&
      (
        process.server ||
        process.SERVER_BUILD ||
        (process.env && process.env.VUE_ENV === 'server')
      )
    ) {
      return
    }

    try {
      const test = '__vue-localstorage-test__'

      window.localStorage.setItem(test, test)
      window.localStorage.removeItem(test)
    } catch (e) {
      console.error('Local storage is not supported')
    }

    const name = options.name || 'localStorage'
    const bind = options.bind

    Vue.mixin({
      beforeCreate () {
        if (this.$options[name]) {
          Object.keys(this.$options[name]).forEach((key) => {
            const config = this.$options[name][key]
            const [type, defaultValue] = [config.type, config.default]

            VueLocalStorage.addProperty(key, type, defaultValue)

            if ((bind || config.bind) && config.bind !== false) {
              this.$options.computed = this.$options.computed || {}

              if (!this.$options.computed[key]) {
                let prefix = config.prefix
                if ((typeof prefix !== 'function')) {
                  const prefixValue = prefix || ''
                  prefix = () => (prefixValue)
                }

                this.$options.computed[key] = {
                  get () {
                    const finalKey = prefix() + key
                    return Vue.localStorage.get(finalKey, defaultValue)
                  },
                  set (val) {
                    const finalKey = prefix() + key
                    Vue.localStorage.set(finalKey, val)
                    this._computedWatchers[key].dirty = true
                  }
                }
              } else {
                console.log(key + ': is already a "computed" member and will not be mapped to the localstorage')
              }
            }
          })
        }
      }
    })

    Vue[name] = VueLocalStorage
    Vue.prototype[`$${name}`] = VueLocalStorage
  }
}
