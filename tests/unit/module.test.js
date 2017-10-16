import Vue from 'vue'

afterEach(jest.resetModules)

test('it should pass an error to console if local storage not available', () => {
  const stubLocalStorage = {
    setItem: (key, value) => {},
    removeItem: () => { throw new Exception('Component is not available') }
  }

  global.localStorage = {}
  global.console.error = jest.fn()

  let vueLocalStorage = require('../../src').default

  Vue.use(vueLocalStorage)

  jest.resetModules()

  vueLocalStorage = require('../../src').default

  Vue.use(vueLocalStorage)

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

test('It can change default $localStorage binding to any other binding with config', () => {
  require('mock-local-storage')

  const Vue = require('vue')
  const VueLocalStorage = require('../../src').default

  Vue.use(VueLocalStorage, {
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

  expect(Vue.localStorage).toEqual(undefined)
})

test('If bind option is true-ish, instaces have computed properties', function() {
  require('mock-local-storage')
  process.server = false

  const Vue = require('vue')
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

test('bound properties hold their values across isntances', function() {
  require('mock-local-storage')
  process.server = false

  const Vue = require('vue')
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

  instance.someNumber = 321;

  expect(instance.someNumber).toBe(321)

  instance.$destroy()
  instance = new Vue(opts);
  expect(instance.someNumber).toBe(321);

})

test('Create compute values with prefix (bind)', function() {
  require('mock-local-storage')
  process.server = false

  const Vue = require('vue')
  const VueLocalStorage = require('../../src').default

  Vue.use(VueLocalStorage, {
    bind: true
  })

  const optsA = {
    render: (h) => h('div'),
    localStorage: {
      someValue: {
        type: String,
        default: 'A',
        prefix: 'a'
      }
    }
  }
  const optsB = {
    render: (h) => h('div'),
    localStorage: {
      someValue: {
        type: String,
        default: 'B',
        prefix() { return 'b' }
      }
    }
  }

  let instanceA = new Vue(optsA)
  let instanceB = new Vue(optsB)

  expect(instanceA.someValue).toBe('A')
  expect(instanceB.someValue).toBe('B')

  instanceA.someValue = 'A2'
  instanceB.someValue = 'B2'

  instanceA.$destroy()
  instanceB.$destroy()

  instanceA = new Vue(optsA)
  instanceB = new Vue(optsB)

  expect(instanceA.someValue).toBe('A2')
  expect(instanceB.someValue).toBe('B2')

})

test('enablement flags for bindings', function() {
  require('mock-local-storage')
  process.server = false

  let Vue = require('vue')
  const VueLocalStorage = require('../../src').default

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
        default: 123,
      }
    }
  })

  expect(instance.someNumber).toBe(123)

  jest.resetModules()
  Vue = require('vue')
  Vue.use(VueLocalStorage, { bind: false })

  instance = new Vue({
    computed: {
      test() {
        return 'test'
      }
    },
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
