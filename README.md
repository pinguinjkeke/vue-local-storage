# VueLocalStorage
Vue.js localStorage plugin with types support

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
      someMethod: {
        let lsValue = this.$localStorage.get('someObject')
        this.$localStorage.set('someBoolean', true)
        this.$localStorage.remove('stringOne')
      }
    }
  })
  ```
## License
  [MIT]
