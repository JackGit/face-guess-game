import Vue from 'vue'
import App from './App'
import { init } from './wx'

Vue.config.productionTip = false

window.game = null
window.loader = null

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

init()