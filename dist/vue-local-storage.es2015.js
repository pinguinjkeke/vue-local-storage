/**
 * vue-local-storage v0.4.1
 * (c) 2017 Alexander Avakov
 * @license MIT
 */
const ls = window.localStorage;

class VueLocalStorage {
  /**
   * VueLocalStorage constructor
   */
  constructor () {
    this._properties = {};
  }

  /**
   * Get value from localStorage
   *
   * @param {String} lsKey
   * @param {*} defaultValue
   * @returns {*}
   */
  get (lsKey, defaultValue = null) {
    if (ls[lsKey]) {
      let type = String;

      for (const key in this._properties) {
        if (key === lsKey) {
          type = this._properties[key].type;
          break
        }
      }

      return this._process(type, ls[lsKey])
    }

    return defaultValue !== null ? defaultValue : null
  }

  /**
   * Set localStorage value
   *
   * @param {String} lsKey
   * @param {*} value
   * @returns {*}
   */
  set (lsKey, value) {
    for (const key in this._properties) {
      const type = this._properties[key].type;

      if ((key === lsKey) && [Array, Object].includes(type)) {
        ls.setItem(lsKey, JSON.stringify(value));

        return value
      }
    }

    ls.setItem(lsKey, value);

    return value
  }

  /**
   * Remove value from localStorage
   *
   * @param {String} lsKey
   */
  remove (lsKey) {
    return ls.removeItem(lsKey)
  }

  /**
   * Add new property to localStorage
   *
   * @param {String} key
   * @param {function} type
   * @param {*} defaultValue
   */
  addProperty (key, type, defaultValue) {
    type = type || String;

    this._properties[key] = { type };

    if (!ls[key] && defaultValue !== null) {
      ls.setItem(key, [Array, Object].includes(type) ? JSON.stringify(defaultValue) : defaultValue);
    }
  }

  /**
   * Process the value before return it from localStorage
   *
   * @param {String} type
   * @param {*} value
   * @returns {*}
   * @private
   */
  _process (type, value) {
    switch (type) {
      case Boolean:
        return value === 'true'
      case Number:
        return parseInt(value, 10)
      case Array:
        try {
          const array = JSON.parse(value);

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

var VueLocalStorage$1 = new VueLocalStorage();

var index = {
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
      const test = '__vue-localstorage-test__';

      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
    } catch (e) {
      console.error('Local storage is not supported');
    }

    const name = options.name || 'localStorage';

    Vue.mixin({
      created () {
        if (this.$options[name]) {
          Object.keys(this.$options[name]).forEach((key) => {
            const [type, defaultValue] = [this.$options[name][key].type, this.$options[name][key].default];

            VueLocalStorage$1.addProperty(key, type, defaultValue);
          });
        }
      }
    });

    Vue[name] = VueLocalStorage$1;
    Vue.prototype[`$${name}`] = VueLocalStorage$1;
  }
};

export default index;
