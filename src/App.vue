<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import '@/assets/css/app.css'
import Playing from '@/views/Playing'
export default {
  name: 'app',
  components: {
    Playing
  }
}
</script>
