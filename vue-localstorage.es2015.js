try {
  'localStorage' in window && window['localStorage'] !== null
} catch (e) {
  console.error('Local storage not supported by this browser')
}

let ls = window.localStorage

class VueLocalStorage {
  /**
   * Get value from localStorage
   *
   * @param {String} lsKey
   * @returns {*}
   */
  static get (lsKey) {
    if (ls.hasOwnProperty(lsKey)) {
      let type = String

      for (let key in VueLocalStorage._properties) {
        if (key === lsKey) {
          type = VueLocalStorage._properties[key].type
          break
        }
      }

      return VueLocalStorage._process(type, ls[lsKey])
    }

    return null
  }

  /**
   * Set localStorage value
   *
   * @returns {*}
   */
  static set () {
    for (let key in VueLocalStorage._properties) {
      let type = VueLocalStorage._properties[key].type

      if ((key === lsKey) && (type === Array || type === Object)) {
        ls[lsKey] = JSON.stringify(value)
        return value
      }
    }

    ls[lsKey] = value

    return value
  }

  /**
   * Remove value from localStorage
   *
   * @param {String} lsKey
   */
  static remove (lsKey) {
    return ls.removeItem(lsKey)
  }

  /**
   * Process the value before return it from localStorage
   *
   * @param {String} type
   * @param {*} value
   * @returns {*}
   * @private
   */
  static _process (type, value) {
    switch (type) {
      case Boolean:
        return value === 'true'
      case Number:
        return parseInt(value, 10)
      case Array:
        try {
          let array = JSON.parse(value)
          return Array.isArray(array) ? array : []
        } catch (e) {
          return []
        }
      case Object:
        try {
          return JSON.parse(value)
        } catch (e) {
          return {}
        }
      default:
        return value
    }
  }
}

/**
 * Properties copied from components
 *
 * @type {Object}
 * @private
 */
VueLocalStorage._properties = {}

export default {
  install: function (Vue) {
    Vue.mixin({
      created: function () {
        if (this.$options.hasOwnProperty('localStorage')) {
          // Copy all properties to _properties object
          for (let key in this.$options.localStorage) {
            if (!VueLocalStorage._properties.hasOwnProperty(key)) {
              VueLocalStorage._properties[key] = {}
            }

            let type = (this.$options.localStorage[key].hasOwnProperty('type'))
              ? this.$options.localStorage[key].type
              : String

            VueLocalStorage._properties[key].type = type

            // Check for default value
            if (!ls.hasOwnProperty(key) && this.$options.localStorage[key].hasOwnProperty('default')
            ) {
              let value = this.$options.localStorage[key].default
              ls[key] = (type === Array || type === Object) ? JSON.stringify(value) : value
            }
          }
        }

        // Global localStorage instance
        this.$localStorage = VueLocalStorage
      }
    })
  }
}
