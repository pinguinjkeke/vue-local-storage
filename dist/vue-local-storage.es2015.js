/**
 * vue-local-storage v0.6.0
 * (c) 2017 Alexander Avakov
 * @license MIT
 */
class VueLocalStorage {
  /**
   * VueLocalStorage constructor
   */
  constructor () {
    this._properties = {};
    this._namespace = '';
    this._isSupported = true;
  }

  /**
   * Namespace getter.
   *
   * @returns {string}
   */
  get namespace () {
    return this._namespace
  }

  /**
   * Namespace setter.
   *
   * @param {string} value
   */
  set namespace (value) {
    this._namespace = value ? `${value}.` : '';
  }

  /**
   * Concatenates localStorage key with namespace prefix.
   *
   * @param {string} lsKey
   * @returns {string}
   * @private
   */
  _getLsKey (lsKey) {
    return `${this._namespace}${lsKey}`
  }

  /**
   * Set a value to localStorage giving respect to the namespace.
   *
   * @param {string} lsKey
   * @param {*} rawValue
   * @param {*} type
   * @private
   */
  _lsSet (lsKey, rawValue, type) {
    const key = this._getLsKey(lsKey);
    const value = type && [Array, Object].includes(type)
      ? JSON.stringify(rawValue)
      : rawValue;

    window.localStorage.setItem(key, value);
  }

  /**
   * Get value from localStorage giving respect to the namespace.
   *
   * @param {string} lsKey
   * @returns {any}
   * @private
   */
  _lsGet (lsKey) {
    const key = this._getLsKey(lsKey);

    return window.localStorage[key]
  }

  /**
   * Get value from localStorage
   *
   * @param {String} lsKey
   * @param {*} defaultValue
   * @param {*} defaultType
   * @returns {*}
   */
  get (lsKey, defaultValue = null, defaultType = String) {
    if (!this._isSupported) {
      return null
    }

    if (this._lsGet(lsKey)) {
      let type = defaultType;

      for (const key in this._properties) {
        if (key === lsKey) {
          type = this._properties[key].type;
          break
        }
      }

      return this._process(type, this._lsGet(lsKey))
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
    if (!this._isSupported) {
      return null
    }

    for (const key in this._properties) {
      const type = this._properties[key].type;

      if ((key === lsKey)) {
        this._lsSet(lsKey, value, type);

        return value
      }
    }

    this._lsSet(lsKey, value);

    return value
  }

  /**
   * Remove value from localStorage
   *
   * @param {String} lsKey
   */
  remove (lsKey) {
    if (!this._isSupported) {
      return null
    }

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

    if (!this._lsGet(key) && defaultValue !== null) {
      this._lsSet(key, defaultValue, type);
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
        return parseFloat(value)
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

var vueLocalStorage = new VueLocalStorage();

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

    let isSupported = true;

    try {
      const test = '__vue-localstorage-test__';

      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
    } catch (e) {
      isSupported = false;
      vueLocalStorage._isSupported = false;

      console.error('Local storage is not supported');
    }

    const name = options.name || 'localStorage';
    const bind = options.bind;

    if (options.namespace) {
      vueLocalStorage.namespace = options.namespace;
    }

    Vue.mixin({
      beforeCreate () {
        if (!isSupported) {
          return
        }

        if (this.$options[name]) {
          Object.keys(this.$options[name]).forEach((key) => {
            const config = this.$options[name][key];
            const [type, defaultValue] = [config.type, config.default];

            vueLocalStorage.addProperty(key, type, defaultValue);

            const existingProp = Object.getOwnPropertyDescriptor(vueLocalStorage, key);

            if (!existingProp) {
              const prop = {
                get: () => Vue.localStorage.get(key, defaultValue),
                set: val => Vue.localStorage.set(key, val),
                configurable: true
              };

              Object.defineProperty(vueLocalStorage, key, prop);
              Vue.util.defineReactive(vueLocalStorage, key, defaultValue);
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

    Vue[name] = vueLocalStorage;
    Vue.prototype[`$${name}`] = vueLocalStorage;
  }
};

export default index;
