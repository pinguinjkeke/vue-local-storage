;(function () {
    try {
        'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        console.error('Local storage not supported by this browser');
    }

    var type, key, value;

    var VueLocalStorage = {
        // Get value from localStorage
        get: function (lsKey) {
            if (window.localStorage.hasOwnProperty(lsKey)) {
                type = String;

                for (key in VueLocalStorage._properties) {
                    if (key === lsKey) {
                        type = VueLocalStorage._properties[key].type;
                        break;
                    }
                }

                return VueLocalStorage._process(type, window.localStorage[lsKey]);
            }

            return null;
        },
        // Set localStorage value
        set: function (lsKey, value) {
            for (key in VueLocalStorage._properties) {
                type = VueLocalStorage._properties[key].type;

                if ((key === lsKey) && (type === Array || type === Object)) {
                    window.localStorage[lsKey] = JSON.stringify(value);
                    return value;
                }
            }

            window.localStorage[lsKey] = value;

            return value;
        },
        // Remove from localStorage
        remove: function (lsKey) {
            return window.localStorage.removeItem(lsKey);
        },
        // Private function that processes the value
        _process: function (type, value) {
            switch (type) {
                case Boolean:
                    return value === 'true';
                case Number:
                    return parseInt(value, 10);
                case Array:
                    try {
                        let array = JSON.parse(value);
                        return Array.isArray(array) ? array : [];
                    } catch (e) {
                        return [];
                    }
                case Object:
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return {};
                    }
                default:
                    return value;
            }
        },
        // Properties Object created from components
        _properties: {}
    };

    var ls = {
        install: function (Vue) {
            Vue.mixin({
                created: function () {
                    if (this.$options.hasOwnProperty('localStorage')) {
                        // Copy all properties to _properties object
                        for (key in this.$options.localStorage) {
                            if (!VueLocalStorage._properties.hasOwnProperty(key)) {
                                VueLocalStorage._properties[key] = {};
                            }

                            type = (this.$options.localStorage[key].hasOwnProperty('type'))
                                ? this.$options.localStorage[key].type
                                : String;

                            VueLocalStorage._properties[key].type = type;

                            // Check for default value
                            if (
                                !window.localStorage.hasOwnProperty(key) &&
                                this.$options.localStorage[key].hasOwnProperty('default')
                            ) {
                                value = this.$options.localStorage[key].default;
                                window.localStorage[key] = (type === Array || type === Object) ? JSON.stringify(value) : value;
                            }
                        }
                    }

                    // Global localStorage instance
                    this.$localStorage = VueLocalStorage;
                }
            });
        }
    };

    if (typeof exports === 'object') {
        module.exports = ls;
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return ls;
        })
    } else if (window.Vue) {
        window.VueLocalStorage = ls;
    }
})();
