/**
 * vee-validate v0.1.3
 * (c) 2017 Abdelrahman Awad
 * @license MIT
 */
const ls$1 = window.localStorage;

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
    if (ls$1[lsKey]) {
      let type = String;

      for (let key in this._properties) {
        if (key === lsKey) {
          type = this._properties[key].type;
          break
        }
      }

      return this._process(type, ls$1[lsKey])
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
    for (let key in this._properties) {
      const type = this._properties[key].type;

      if ((key === lsKey) && [Array, Object].includes(type)) {
        ls$1.setItem(lsKey, JSON.stringify(value));

        return value
      }
    }

    ls$1.setItem(lsKey, value);

    return value
  }

  /**
   * Remove value from localStorage
   *
   * @param {String} lsKey
   */
  remove (lsKey) {
    return ls$1.removeItem(lsKey)
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

    if (!ls$1[key] && defaultValue !== null) {
      ls$1.setItem(key, [Array, Object].includes(type) ? JSON.stringify(defaultValue) : defaultValue);
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

const vueLocalStorage = new VueLocalStorage();

const ls = window.localStorage;

try {
  const test = '__vue-localstorage-test__';

  ls.setItem(test, test);
  ls.removeItem(test);
} catch (e) {
  console.error('Local storage is not supported');
}

var index = {
  install: (Vue) => {
    Vue.mixin({
      created () {
        if (this.$options.localStorage) {
          Object.keys(this.$options.localStorage).forEach((key) => {
            const [type, defaultValue] = [this.$options.localStorage[key].type, this.$options.localStorage[key].default];

            vueLocalStorage.addProperty(key, type, defaultValue);
          });
        }
      }
    });

    Vue.localStorage = vueLocalStorage;
    Vue.prototype.$localStorage = vueLocalStorage;
  }
};

export default index;
