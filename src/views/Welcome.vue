<template>
  <div class="c-welcomeView">
    <div class="c-clouds">
      <img class="c-cloud c0" src="../assets/images/cloud_01.png">
      <img class="c-cloud c1" src="../assets/images/cloud_02.png">
    </div>
    <div class="c-logo">
      <img class="c-logo__img" src="../assets/images/logo.png">
      <img class="c-logo__txt" src="../assets/images/logo_text.png">
    </div>
    <canvas ref="canvas" class="c-welcomeView__spark"></canvas>

    <button @click="start()" style="position:absolute;z-index:10">开始</button>
  </div>
</template>

<script>
import '@/assets/css/welcome-view.css'
import Fire from '@/libs/Fire'

export default {
  fire: null,

  mounted () {
    this.initFire()
  },

  destroy () {
    this.$options.fire.destroy()
  },

  methods: {
    initFire () {
      let fire = new Fire(this.$refs.canvas, {
        width: window.innerWidth,
        height: window.innerHeight,
        enableFlame: false,
        enableSpark2: false,
        skipFrame: function () {
          return {
            flame: true,
    				spark: Date.now() % 5 !== 0,
    				spark2: true
          }
        }
      })
      fire.updatePosition(window.innerWidth * .5, window.innerHeight * 1.4)
      fire.start()
      this.$options.fire = fire
    },
    start () {
      this.$router.replace({ name: 'Playing' })
    }
  }
}
</script>
