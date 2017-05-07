import Vue from 'vue'

afterEach(jest.resetModules)

test('it should pass an error to console if local storage not available', () => {
  const stubLocalStorage = {
    setItem: (key, value) => {},
    removeItem: () => { throw new Exception('Component is not available') }
  }

  global.localStorage = stubLocalStorage
  global.console.error = jest.fn()

  require('../../src')

  jest.resetModules()

  stubLocalStorage.setItem = stubLocalStorage.removeItem

  require('../../src')

  expect(console.error.mock.calls.length).toBe(2)
  expect(console.error.mock.calls[0][0]).toBe('Local storage is not supported')
  expect(console.error.mock.calls[1][0]).toBe('Local storage is not supported')
})

test('it adds localStorage object on Vue prototype and instance', () => {
  require('mock-local-storage')

  const Vue = require('vue')
  const VueLocalStorage = require('../../src').default

  Vue.use(VueLocalStorage)

  const instance = new Vue({
    render: (h) => h('div')
  })

  const vueLocalStorageObject = require('../../src/VueLocalStorage').default

  expect(instance.$localStorage).toBe(vueLocalStorageObject)
  expect(Vue.prototype.$localStorage).toBe(vueLocalStorageObject)
  expect(Vue.localStorage).toBe(vueLocalStorageObject)
})

test('it adds all properties from components or Vue instance', () => {
  require('mock-local-storage')

  const Vue = require('vue')
  const VueLocalStorage = require('../../src').default

  Vue.use(VueLocalStorage)

  const instance = new Vue({
    render: (h) => h('div'),
    localStorage: {
      theObject: {
        type: Object,
        default: { hello: 'world' }
      }
    }
  })

  expect(Vue.localStorage.get('theObject')).toEqual({ hello: 'world' })
})