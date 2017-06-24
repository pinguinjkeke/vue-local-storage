import VueLocalStorage from './VueLocalStorage'

const ls = window.localStorage

try {
  const test = '__vue-localstorage-test__'

  ls.setItem(test, test)
  ls.removeItem(test)
} catch (e) {
  console.error('Local storage is not supported')
}

export default {
  /**
   * Install vue-local-storage plugin
   *
   * @param {Vue} Vue
   * @param {Object} options
   */
  install: (Vue, options = {}) => {
    const name = options.name || 'localStorage'

    Vue.mixin({
      created () {
        if (this.$options[name]) {
          Object.keys(this.$options[name]).forEach((key) => {
            const [type, defaultValue] = [this.$options[name][key].type, this.$options[name][key].default]

            VueLocalStorage.addProperty(key, type, defaultValue)
          })
        }
      }
    })

    Vue[name] = VueLocalStorage
    Vue.prototype[`$${name}`] = VueLocalStorage
  }
}
