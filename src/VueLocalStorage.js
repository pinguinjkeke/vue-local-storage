const ls = window.localStorage

class VueLocalStorage {
  /**
   * VueLocalStorage constructor
   */
  constructor () {
    this._properties = {}
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
      let type = String

      for (const key in this._properties) {
        if (key === lsKey) {
          type = this._properties[key].type
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
      const type = this._properties[key].type

      if ((key === lsKey) && [Array, Object].includes(type)) {
        ls.setItem(lsKey, JSON.stringify(value))

        return value
      }
    }

    ls.setItem(lsKey, value)

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
    type = type || String

    this._properties[key] = { type }

    if (!ls[key] && defaultValue !== null) {
      ls.setItem(key, [Array, Object].includes(type) ? JSON.stringify(defaultValue) : defaultValue)
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
          const array = JSON.parse(value)

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

export default new VueLocalStorage()
