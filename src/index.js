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

            const existingProp = Object.getOwnPropertyDescriptor(VueLocalStorage, key)

            if (!existingProp) {
              const prop = {
                get: () => Vue.localStorage.get(key, defaultValue),
                set: val => Vue.localStorage.set(key, val),
                configurable: true
              }

              Object.defineProperty(VueLocalStorage, key, prop)
              Vue.util.defineReactive(VueLocalStorage, key, defaultValue)
            } else if (!Vue.config.silent) {
              console.log(`${key}: is already defined and will be reused`)
            }

            if ((bind || config.bind) && config.bind !== false) {
              this.$options.computed = this.$options.computed || {}

              if (!this.$options.computed[key]) {
                this.$options.computed[key] = {
                  get: () => Vue.localStorage[key],
                  set: (val) => { Vue.localStorage[key] = val }
                }
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
