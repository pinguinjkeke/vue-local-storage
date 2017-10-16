/**
 * vue-local-storage v0.5.0
 * (c) 2017 Alexander Avakov
 * @license MIT
 */
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
    if (window.localStorage[lsKey]) {
      let type = String;

      for (const key in this._properties) {
        if (key === lsKey) {
          type = this._properties[key].type;
          break
        }
      }

      return this._process(type, window.localStorage[lsKey])
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
        window.localStorage.setItem(lsKey, JSON.stringify(value));

        return value
      }
    }

    window.localStorage.setItem(lsKey, value);

    return value
  }

  /**
   * Remove value from localStorage
   *
   * @param {String} lsKey
   */
  remove (lsKey) {
    return window.localStorage.removeItem(lsKey)
  }

  /**
   * Add new property to localStorage
   *
   * @param {String} key
   * @param {function} type
   * @param {*} defaultValue
   */
  addProperty (key, type, defaultValue = undefined) {
    type = type || String;

    this._properties[key] = { type };

    if (!window.localStorage[key] && defaultValue !== null) {
      window.localStorage.setItem(
        key,
        [Array, Object].includes(type) ? JSON.stringify(defaultValue) : defaultValue
      );
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
    const bind = options.bind;

    Vue.mixin({
      beforeCreate () {
        if (this.$options[name]) {
          Object.keys(this.$options[name]).forEach((key) => {
            const config = this.$options[name][key];
            const [type, defaultValue] = [config.type, config.default];

            VueLocalStorage$1.addProperty(key, type, defaultValue);

            const existingProp = Object.getOwnPropertyDescriptor(VueLocalStorage$1, key);

            if (!existingProp) {
              const prop = {
                get: () => Vue.localStorage.get(key, defaultValue),
                set: val => Vue.localStorage.set(key, val),
                configurable: true
              };

              Object.defineProperty(VueLocalStorage$1, key, prop);
              Vue.util.defineReactive(VueLocalStorage$1, key, defaultValue);
            } else if (!Vue.config.silent) {
              console.log(`${key}: is already defined and will be reused`);
            }

            if ((bind || config.bind) && config.bind !== false) {
              this.$options.computed = this.$options.computed || {};

              if (!this.$options.computed[key]) {
                this.$options.computed[key] = {
                  get: () => Vue.localStorage[key],
                  set: (val) => { Vue.localStorage[key] = val; }
                };
              }
            }
          });
        }
      }
    });

    Vue[name] = VueLocalStorage$1;
    Vue.prototype[`$${name}`] = VueLocalStorage$1;
  }
};

export default index;
