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
  install (Vue) {
    Vue.mixin({
      created () {
        if (this.$options.localStorage) {
          Object.keys(this.$options.localStorage).forEach((key) => {
            const [type, defaultValue] = [this.$options.localStorage[key].type, this.$options.localStorage[key].default]

            VueLocalStorage.addProperty(key, type, defaultValue)
          })
        }

        // Global localStorage instance
        this.$localStorage = VueLocalStorage
      }
    })

    Vue.prototype.localStorage = VueLocalStorage
  }
}
