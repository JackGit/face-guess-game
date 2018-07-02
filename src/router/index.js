import Vue from 'vue'
import Router from 'vue-router'
import Playing from '@/views/Playing'
import Result from '@/views/Result'

Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/playing',
    name: 'Playing',
    component: Playing
  }, {
    path: '/result',
    name: 'Result',
    component: Result
  }]
})

export default router
