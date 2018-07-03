<template>
  <div id="app">
    <transition name="fade">
      <loading v-if="status === 'loading'" @start="startHandler" />
    </transition>
    <transition name="fade">
      <playing v-if="status === 'playing'" :level="gameLevel" @end="gameEndHandler" />
    </transition>
    <transition name="fade">
      <result v-if="status === 'end'" @again="playAgainHandler" />
    </transition>
  </div>
</template>

<script>
import Loading from '@/views/Loading'
import Playing from '@/views/Playing'
import Result from '@/views/Result'

export default {
  name: 'app',
  components: {
    Loading,
    Playing,
    Result
  },

  data () {
    return {
      status: 'loading', // loading, playing, ended
      gameLevel: null
    }
  },

  methods: {
    startHandler (level) { // 1: 伪球迷 2: 资深球迷
      this.status = 'playing'
      this.gameLevel = level
    },
    gameEndHandler () {
      this.status = 'ended'
    },
    playAgainHandler () {
      this.status = 'playing'
    }
  }
}
</script>

<style>
@font-face {
  font-family: Russia;
  src: url('~@/assets/fonts/russia.ttf');
}

html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  background: #336295;
  /* background: #fff; */
  color: #fff;
  font-family: Russia, '微软雅黑';
}

/* transition animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
