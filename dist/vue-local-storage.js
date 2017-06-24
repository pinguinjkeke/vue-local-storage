/**
 * vue-local-storage v0.2.0
 * (c) 2017 Abdelrahman Awad
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VeeValidate = factory());
}(this, (function () { 'use strict';

var ls$1 = window.localStorage;

var VueLocalStorage = function VueLocalStorage () {
  this._properties = {};
};

/**
 * Get value from localStorage
 *
 * @param {String} lsKey
 * @param {*} defaultValue
 * @returns {*}
 */
VueLocalStorage.prototype.get = function get (lsKey, defaultValue) {
    var this$1 = this;
    if ( defaultValue === void 0 ) defaultValue = null;

  if (ls$1[lsKey]) {
    var type = String;

    for (var key in this$1._properties) {
      if (key === lsKey) {
        type = this$1._properties[key].type;
        break
      }
    }

    return this._process(type, ls$1[lsKey])
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

  for (var key in this$1._properties) {
    var type = this$1._properties[key].type;

    if ((key === lsKey) && [Array, Object].includes(type)) {
      ls$1.setItem(lsKey, JSON.stringify(value));

      return value
    }
  }

  ls$1.setItem(lsKey, value);

  return value
};

/**
 * Remove value from localStorage
 *
 * @param {String} lsKey
 */
VueLocalStorage.prototype.remove = function remove (lsKey) {
  return ls$1.removeItem(lsKey)
};

/**
 * Add new property to localStorage
 *
 * @param {String} key
 * @param {function} type
 * @param {*} defaultValue
 */
VueLocalStorage.prototype.addProperty = function addProperty (key, type, defaultValue) {
  type = type || String;

  this._properties[key] = { type: type };

  if (!ls$1[key] && defaultValue !== null) {
    ls$1.setItem(key, [Array, Object].includes(type) ? JSON.stringify(defaultValue) : defaultValue);
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
      return parseInt(value, 10)
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

var VueLocalStorage$1 = new VueLocalStorage();

var ls = window.localStorage;

try {
  var test = '__vue-localstorage-test__';

  ls.setItem(test, test);
  ls.removeItem(test);
} catch (e) {
  console.error('Local storage is not supported');
}

var index = {
  /**
   * Install vue-local-storage plugin
   *
   * @param {Vue} Vue
   * @param {Object} options
   */
  install: function (Vue, options) {
    if ( options === void 0 ) options = {};

    var name = options.name || 'localStorage';

    Vue.mixin({
      created: function created () {
        var this$1 = this;

        if (this.$options[name]) {
          Object.keys(this.$options[name]).forEach(function (key) {
            var ref = [this$1.$options[name][key].type, this$1.$options[name][key].default];
            var type = ref[0];
            var defaultValue = ref[1];

            VueLocalStorage$1.addProperty(key, type, defaultValue);
          });
        }
      }
    });

    Vue[name] = VueLocalStorage$1;
    Vue.prototype[("$" + name)] = VueLocalStorage$1;
  }
};

return index;

})));
