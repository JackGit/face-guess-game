<template>
  <div class="c-welcomeView">
    <div class="c-clouds">
      <img class="c-cloud c0" src="http://qiniu.jackyang.me/h5/image/cloud_01.png">
      <img class="c-cloud c1" src="http://qiniu.jackyang.me/h5/image/cloud_02.png">
    </div>
    <div class="c-logo">
      <img class="c-logo__img" src="http://qiniu.jackyang.me/h5/image/logo.png">
      <img class="c-logo__txt" src="http://qiniu.jackyang.me/h5/image/logo_text.png">
    </div>
    <canvas ref="canvas" class="c-welcomeView__spark"></canvas>

    <p style="position:absolute;top:60%;width:100%;text-align:center;color:rgba(255,255,255,.9)">测试一下你的反贪能力</p>
    <span class="c-welcomeView__start" @click="start()">GO</span>
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
