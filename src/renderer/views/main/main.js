import Vue from 'vue'
// import axios from 'axios'

import App from './App'
import iView from 'iview'
// import { ipcRenderer } from 'electron'
import 'iview/dist/styles/iview.css' // 使用 CSS

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
// Vue.config.productionTip = false

Vue.use(iView)
/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
