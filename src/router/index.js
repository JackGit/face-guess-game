import Vue from 'vue'
import Router from 'vue-router'
import Loading from '@/views/Loading'
import Playing from '@/views/Playing'

Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/loading',
    name: 'Loading',
    component: Loading
  }, {
    path: '/playing',
    name: 'Playing',
    component: Playing
  }]
})

export default router
