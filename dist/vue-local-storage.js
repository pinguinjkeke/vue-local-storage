/**
 * vue-local-storage v0.6.0
 * (c) 2017 Alexander Avakov
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueLocalStorage = factory());
}(this, (function () { 'use strict';

var VueLocalStorage = function VueLocalStorage () {
  this._properties = {};
  this._namespace = '';
  this._isSupported = true;
};

var prototypeAccessors = { namespace: {} };

/**
 * Namespace getter.
 *
 * @returns {string}
 */
prototypeAccessors.namespace.get = function () {
  return this._namespace
};

/**
 * Namespace setter.
 *
 * @param {string} value
 */
prototypeAccessors.namespace.set = function (value) {
  this._namespace = value ? (value + ".") : '';
};

/**
 * Concatenates localStorage key with namespace prefix.
 *
 * @param {string} lsKey
 * @returns {string}
 * @private
 */
VueLocalStorage.prototype._getLsKey = function _getLsKey (lsKey) {
  return ("" + (this._namespace) + lsKey)
};

/**
 * Set a value to localStorage giving respect to the namespace.
 *
 * @param {string} lsKey
 * @param {*} rawValue
 * @param {*} type
 * @private
 */
VueLocalStorage.prototype._lsSet = function _lsSet (lsKey, rawValue, type) {
  var key = this._getLsKey(lsKey);
  var value = type && [Array, Object].includes(type)
    ? JSON.stringify(rawValue)
    : rawValue;

  window.localStorage.setItem(key, value);
};

/**
 * Get value from localStorage giving respect to the namespace.
 *
 * @param {string} lsKey
 * @returns {any}
 * @private
 */
VueLocalStorage.prototype._lsGet = function _lsGet (lsKey) {
  var key = this._getLsKey(lsKey);

  return window.localStorage[key]
};

/**
 * Get value from localStorage
 *
 * @param {String} lsKey
 * @param {*} defaultValue
 * @param {*} defaultType
 * @returns {*}
 */
VueLocalStorage.prototype.get = function get (lsKey, defaultValue, defaultType) {
    var this$1 = this;
    if ( defaultValue === void 0 ) defaultValue = null;
    if ( defaultType === void 0 ) defaultType = String;

  if (!this._isSupported) {
    return null
  }

  if (this._lsGet(lsKey)) {
    var type = defaultType;

    for (var key in this$1._properties) {
      if (key === lsKey) {
        type = this$1._properties[key].type;
        break
      }
    }

    return this._process(type, this._lsGet(lsKey))
  }

  return defaultValue !== null ? defaultValue : null
};

/**
 * Set localStorage value
 *
 * @param {String} lsKey
 * @param {*} value
 * @returns {*}
 */
VueLocalStorage.prototype.set = function set (lsKey, value) {
    var this$1 = this;

  if (!this._isSupported) {
    return null
  }

  for (var key in this$1._properties) {
    var type = this$1._properties[key].type;

    if ((key === lsKey)) {
      this$1._lsSet(lsKey, value, type);

      return value
    }
  }

  this._lsSet(lsKey, value);

  return value
};

/**
 * Remove value from localStorage
 *
 * @param {String} lsKey
 */
VueLocalStorage.prototype.remove = function remove (lsKey) {
  if (!this._isSupported) {
    return null
  }

  return window.localStorage.removeItem(lsKey)
};

/**
 * Add new property to localStorage
 *
 * @param {String} key
 * @param {function} type
 * @param {*} defaultValue
 */
VueLocalStorage.prototype.addProperty = function addProperty (key, type, defaultValue) {
    if ( defaultValue === void 0 ) defaultValue = undefined;

  type = type || String;

  this._properties[key] = { type: type };

  if (!this._lsGet(key) && defaultValue !== null) {
    this._lsSet(key, defaultValue, type);
  }
};

/**
 * Process the value before return it from localStorage
 *
 * @param {String} type
 * @param {*} value
 * @returns {*}
 * @private
 */
VueLocalStorage.prototype._process = function _process (type, value) {
  switch (type) {
    case Boolean:
      return value === 'true'
    case Number:
      return parseFloat(value)
    case Array:
      try {
        var array = JSON.parse(value);

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
};

Object.defineProperties( VueLocalStorage.prototype, prototypeAccessors );

var vueLocalStorage = new VueLocalStorage();

var index = {
  /**
   * Install vue-local-storage plugin
   *
   * @param {Vue} Vue
   * @param {Object} options
   */
  install: function (Vue, options) {
    if ( options === void 0 ) options = {};

    if (typeof process !== 'undefined' &&
      (
        process.server ||
        process.SERVER_BUILD ||
        (process.env && process.env.VUE_ENV === 'server')
      )
    ) {
      return
    }

    var isSupported = true;

    try {
      var test = '__vue-localstorage-test__';

      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
    } catch (e) {
      isSupported = false;
      vueLocalStorage._isSupported = false;

      console.error('Local storage is not supported');
    }

    var name = options.name || 'localStorage';
    var bind = options.bind;

    if (options.namespace) {
      vueLocalStorage.namespace = options.namespace;
    }

    Vue.mixin({
      beforeCreate: function beforeCreate () {
        var this$1 = this;

        if (!isSupported) {
          return
        }

        if (this.$options[name]) {
          Object.keys(this.$options[name]).forEach(function (key) {
            var config = this$1.$options[name][key];
            var ref = [config.type, config.default];
            var type = ref[0];
            var defaultValue = ref[1];

            vueLocalStorage.addProperty(key, type, defaultValue);

            var existingProp = Object.getOwnPropertyDescriptor(vueLocalStorage, key);

            if (!existingProp) {
              var prop = {
                get: function () { return Vue.localStorage.get(key, defaultValue); },
                set: function (val) { return Vue.localStorage.set(key, val); },
                configurable: true
              };

              Object.defineProperty(vueLocalStorage, key, prop);
              Vue.util.defineReactive(vueLocalStorage, key, defaultValue);
            } else if (!Vue.config.silent) {
              console.log((key + ": is already defined and will be reused"));
            }

            if ((bind || config.bind) && config.bind !== false) {
              this$1.$options.computed = this$1.$options.computed || {};

              if (!this$1.$options.computed[key]) {
                this$1.$options.computed[key] = {
                  get: function () { return Vue.localStorage[key]; },
                  set: function (val) { Vue.localStorage[key] = val; }
                };
              }
            }
          });
        }
      }
    });

    Vue[name] = vueLocalStorage;
    Vue.prototype[("$" + name)] = vueLocalStorage;
  }
};

return index;

})));
