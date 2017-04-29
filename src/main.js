import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

window.game = null
window.loader = null

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
