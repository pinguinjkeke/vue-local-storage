let Vue = require('vue')
let plugin
let vueLocalStorage = require('../../src/VueLocalStorage').default

beforeEach(() => {
  plugin = require('../../src').default
  jest.resetAllMocks()
})

afterEach(() => {
  jest.resetModules()
})

test('it should pass an error to console if local storage not available', () => {
  Vue.use(plugin)
  expect(console.error.mock.calls.length).toBe(1)
  expect(console.error.mock.calls[0][0]).toBe('Local storage is not supported')
})

test('it adds localStorage object on Vue prototype and instance', () => {
  const instance = new Vue({
    render: (h) => h('div')
  })

  expect(instance.$localStorage).toBe(vueLocalStorage)
  expect(Vue.prototype.$localStorage).toBe(vueLocalStorage)
  expect(Vue.localStorage).toBe(vueLocalStorage)
})

test('it adds all properties from components or Vue instance', () => {
  require('mock-local-storage')

  Vue.use(plugin)

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

test('It can change default $localStorage binding to any other binding with config', () => {
  require('mock-local-storage')

  vueLocalStorage = require('../../src').default

  Vue.use(vueLocalStorage, {
    name: 'ls'
  })

  const instance = new Vue({
    render: (h) => h('div'),
    ls: {
      someNumber: {
        type: Number,
        default: 123
      }
    }
  })

  expect(Vue.ls.get('someNumber')).toEqual(123)
  expect(instance.$ls.get('someNumber')).toEqual(123)
})

test('It wont install when using SSR', () => {
  Vue.localStorage = undefined
  process.server = true

  const VueLocalStorage = require('../../src').default

  Vue.use(VueLocalStorage)

  expect(Vue.localStorage).toBeUndefined()
  process.server = false
})

test('If bind option is truthy, instances will have computed properties', () => {
  require('mock-local-storage')

  const VueLocalStorage = require('../../src').default

  Vue.use(VueLocalStorage, {
    bind: true
  })

  const instance = new Vue({
    render: (h) => h('div'),
    localStorage: {
      someNumber: {
        type: Number,
        default: 123
      }
    }
  })

  expect(instance.someNumber).toBe(123)
})

test('bound properties hold their values across isntances', () => {
  require('mock-local-storage')

  const VueLocalStorage = require('../../src').default

  Vue.use(VueLocalStorage, {
    bind: true
  })

  const opts = {
    render: (h) => h('div'),
    localStorage: {
      someNumber: {
        type: Number,
        default: 123
      }
    }
  }
  let instance = new Vue(opts)

  expect(instance.someNumber).toBe(123)

  instance.someNumber = 321

  expect(instance.someNumber).toBe(321)

  instance.$destroy()
  instance = new Vue(opts)
  expect(instance.someNumber).toBe(321)
})

test('enablement flags for bindings', () => {
  require('mock-local-storage')

  let Vue = require('vue')
  let VueLocalStorage = require('../../src').default

  Vue.use(VueLocalStorage, { bind: true })

  let instance = new Vue({
    localStorage: {
      someNumber: {
        type: Number,
        default: 123,
        bind: false
      }
    }
  })

  expect(instance.someNumber).toBeUndefined()

  instance = new Vue({
    localStorage: {
      someNumber: {
        type: Number,
        default: 123
      }
    }
  })

  expect(instance.someNumber).toBe(123)

  jest.resetModules()
  require('mock-local-storage')
  Vue = require('vue')
  VueLocalStorage = require('../../src').default
  Vue.use(VueLocalStorage, { bind: false })

  instance = new Vue({
    localStorage: {
      someNumber: {
        type: Number,
        default: 123
      }
    }
  })

  expect(instance.someNumber).toBeUndefined()

  instance = new Vue({
    localStorage: {
      someNumber: {
        type: Number,
        default: 123,
        bind: true
      }
    }
  })

  expect(instance.someNumber).toBe(123)
})

test('It sets namespace property if it\'s specified', () => {
  require('mock-local-storage')

  const VueLocalStorage = require('../../src').default

  const namespace = 'testNamespace'

  Vue.use(VueLocalStorage, { namespace })

  const instance = new Vue({
    localStorage: { }
  })

  expect(instance.$localStorage.namespace).toEqual(namespace + '.')
})
