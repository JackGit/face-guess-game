<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import '@/assets/css/app.css'
export default {
  name: 'app'
}
</script>
