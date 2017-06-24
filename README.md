# VueLocalStorage
[![npm version](https://img.shields.io/npm/v/vue-localstorage.svg)](https://www.npmjs.com/package/vue-localstorage)
[![npm downloads](https://img.shields.io/npm/dt/vue-localstorage.svg)](https://www.npmjs.com/package/vue-localstorage)

localStorage plugin with types support for Vue.js and Vue.js 2.

## Install

  ``` bash
  npm install vue-localstorage --save
  ```
  or
  ``` bash
  bower install vue-localstorage
  ```

## Usage
  ``` js
  import VueLocalStorage from 'vue-localstorage'
  
  Vue.use(VueLocalStorage)
  // Or you can specify any other name and use it via this.$ls, this.$whatEverYouWant
  Vue.use(VueLocalStorage, {
    name: 'ls'
  }

  // Use localStorage from Vue object
  Vue.localStorage.set('someNumber', 123)
  Vue.localStorage.get('someNumber')

  // Fallback value if nothing found in localStorage
  Vue.localStorage.get('propertyThatNotExists', 'fallbackValue') // Will return 'fallbackValue' string
  
  var vm = new Vue({
    localStorage: {
      someObject: {
        type: Object,
        default: {
          hello: 'world'
        }
      },
      someNumber: {
        type: Number,
      },
      someBoolean: {
        type: Boolean
      },
      stringOne: '',
      stringTwo: {
        type: String,
        default: 'helloworld!'
      },
      stringThree: {
        default: 'hello'
      }
    },
    methods: {
      someMethod () {
        let lsValue = this.$localStorage.get('someObject')
        this.$localStorage.set('someBoolean', true)
        this.$localStorage.remove('stringOne')
      }
    }
  })
  ```
## License
  [MIT]
