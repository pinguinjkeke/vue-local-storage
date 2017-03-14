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
