/* global afterEach, test, expect, localStorage  */

import 'mock-local-storage'
import vueLocalStorage from '../../src/VueLocalStorage'

afterEach(localStorage.clear)

test('It returns null if no value exists', () => {
  expect(vueLocalStorage.get('somethingThatNotEverExist')).toBe(null)
})

test('Get method has ability to return default if localStorage is empty', () => {
  expect(vueLocalStorage.get('somethingThatNotEverExist', 'defaultValue')).toBe('defaultValue')
})

test('Working with String', () => {
  // String is default type, so it's not necessary to provide type
  vueLocalStorage.addProperty('someString')
  localStorage.setItem('someString', 'hello')
  expect(vueLocalStorage.get('someString')).toBe('hello')

  vueLocalStorage.set('someString', 'bye')
  expect(localStorage.getItem('someString')).toBe('bye')
  expect(vueLocalStorage.get('someString')).toBe('bye')

  // Check ability to work with default value
  vueLocalStorage.addProperty('someStringTwo', String, 'hello')
  expect(vueLocalStorage.get('someStringTwo')).toBe('hello')

  vueLocalStorage.set('someStringTwo', 'bye')
  expect(vueLocalStorage.get('someStringTwo')).toBe('bye')
})

test('Working with Number', () => {
  vueLocalStorage.addProperty('someNumber', Number)
  localStorage.setItem('someNumber', '1')
  expect(vueLocalStorage.get('someNumber')).toBe(1)

  vueLocalStorage.set('someNumber', 3)
  expect(vueLocalStorage.get('someNumber')).toBe(3)

  vueLocalStorage.addProperty('someNumberTwo', Number, 2)
  expect(vueLocalStorage.get('someNumberTwo')).toBe(2)
})

test('Working with Boolean', () => {
  vueLocalStorage.addProperty('someBoolean', Boolean)
  localStorage.setItem('someBoolean', true)
  expect(vueLocalStorage.get('someBoolean')).toBe(true)

  vueLocalStorage.set('someBoolean', false)
  expect(vueLocalStorage.get('someBoolean')).toBe(false)

  vueLocalStorage.addProperty('someBooleanTwo', Boolean, false)
  expect(vueLocalStorage.get('someBooleanTwo')).toBe(false)

  vueLocalStorage.set('someBooleanTwo', true)
  expect(vueLocalStorage.get('someBooleanTwo')).toBe(true)
})

test('Working with Array', () => {
  vueLocalStorage.addProperty('someArray', Array)
  localStorage.setItem('someArray', JSON.stringify([1, 2, 3]))
  expect(vueLocalStorage.get('someArray')).toEqual([1, 2, 3])

  vueLocalStorage.set('someArray', [4, 5, 6])
  expect(vueLocalStorage.get('someArray')).toEqual([4, 5, 6])

  vueLocalStorage.addProperty('someArrayTwo', Array, [7, 8, 9])
  expect(vueLocalStorage.get('someArrayTwo')).toEqual([7, 8, 9])

  vueLocalStorage.set('someArrayTwo', [10, 11, 12])
  expect(vueLocalStorage.get('someArrayTwo')).toEqual([10, 11, 12])
})

test('It reutrns empty Array if JSON parsed to Object or something else', () => {
  vueLocalStorage.addProperty('someWrongCastArray', Array)
  localStorage.setItem('someWrongCastArray', '{"a":"b"}')

  expect(vueLocalStorage.get('someWrongCastArray')).toEqual([])
})

test('It returns empty Array on JSON parse exception', () => {
  vueLocalStorage.addProperty('someFailArray', Array)
  localStorage.setItem('someFailArray', 'fdsafds]WR0nGJ$0N')

  expect(vueLocalStorage.get('someFailArray')).toEqual([])
})

test('Working with Object', () => {
  const obj = {
    its: {
      really: {
        deep: 'object',
        withNumbers: 123,
        or: {
          withBooleans: true
        }
      }
    }
  }

  vueLocalStorage.addProperty('someObject', Object)
  localStorage.setItem('someObject', JSON.stringify(obj))
  expect(vueLocalStorage.get('someObject')).toEqual(obj)

  const newObj = {
    newly: {
      created: {
        super: 'object'
      }
    }
  }

  vueLocalStorage.set('someObject', newObj)
  expect(vueLocalStorage.get('someObject')).toEqual(newObj)

  vueLocalStorage.addProperty('someObjectTwo', Object, newObj)
  expect(vueLocalStorage.get('someObjectTwo')).toEqual(newObj)

  const thirdObj = {
    hello: {
      from: 'Russia'
    }
  }

  vueLocalStorage.set('someObjectTwo', thirdObj)
  expect(vueLocalStorage.get('someObjectTwo')).toEqual(thirdObj)
})

test('It returns empty Object on JSON parse exception', () => {
  vueLocalStorage.addProperty('someFailObject', Object)
  localStorage.setItem('someFailObject', 'wr0ngObject(((')

  expect(vueLocalStorage.get('someFailObject')).toEqual({})
})

test('Default type can be provided', () => {
  const key = 'somethingWithOverridden'

  localStorage.setItem(key, 123)

  expect(vueLocalStorage.get(key, null, Number)).toEqual(123)
})

test('It has ability to remove items from local storage', () => {
  vueLocalStorage.addProperty('somethingWillBeRemoved', Number)
  localStorage.setItem('somethingWillBeRemoved', 123)
  expect(vueLocalStorage.get('somethingWillBeRemoved')).toBe(123)

  vueLocalStorage.remove('somethingWillBeRemoved')
  expect(vueLocalStorage.get('somethingWillBeRemoved')).toBe(null)

  vueLocalStorage.addProperty('someObjectToRemove', Object, { hello: 'world' })
  expect(vueLocalStorage.get('someObjectToRemove')).toEqual({ hello: 'world' })

  vueLocalStorage.remove('someObjectToRemove')
  expect(vueLocalStorage.get('someObjectToRemove')).toBe(null)
})

test('If property with the same name will be added twice, it replaces older', () => {
  vueLocalStorage.addProperty('somethingToReplace', Number, 123)
  expect(vueLocalStorage.get('somethingToReplace')).toBe(123)
  vueLocalStorage.addProperty('somethingToReplace', String)
  expect(vueLocalStorage.get('somethingToReplace')).toBe('123')
})

test('It adds dot to namespace value if it isn\'t empty', () => {
  const namespace = 'testNamespace'
  vueLocalStorage.namespace = namespace

  expect(vueLocalStorage.namespace).toBe(`${namespace}.`)
})

test('It doesn\'t modify namespace if it\'s empty', () => {
  vueLocalStorage.namespace = ''
  expect(vueLocalStorage.namespace).toBe('')
})

test('It sets namespace as empty string if it\'s empty', () => {
  vueLocalStorage.namespace = undefined
  expect(vueLocalStorage.namespace).toBe('')
})

test('It adds namespace to localStorage keys', () => {
  const namespace = 'testNamespace'
  vueLocalStorage.namespace = namespace

  // Dynamic
  vueLocalStorage.set('someKey', 'hello')
  expect(localStorage.getItem(`${namespace}.someKey`)).toBe('hello')
  expect(vueLocalStorage.get('someKey')).toBe('hello')

  // Predefined
  vueLocalStorage.addProperty('otherKey')
  vueLocalStorage.set('otherKey', 'what')
  expect(localStorage.getItem(`${namespace}.otherKey`)).toBe('what')
  expect(vueLocalStorage.get('otherKey')).toBe('what')
})

