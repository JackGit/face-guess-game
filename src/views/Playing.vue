<template>
  <div class="c-playingView">
    <header class="c-playingView__header">
      <img class="c-playingView__logo" src="../assets/images/logo_text_small.png">
    </header>

    <div class="c-sniper">
      <!-- the mask -->
      <img class="c-sniper__aim" src="../assets/images/sniper_view.png">
      <!-- the interlace area -->
      <div class="c-interlace" ref="interlace"></div>
      <!-- cloud -->
      <img src="../assets/images/cloud_02.png" class="c-sniper__cloud">
      <!-- spark -->
      <canvas ref="canvas" class="c-sniper__spark"></canvas>
    </div>

    <!-- selections -->
    <ul class="c-playingView__selections">
      <li class="c-selections__item">侯亮平</li>
      <li class="c-selections__item">陈清泉</li>
      <li class="c-selections__item">高育良</li>
      <li class="c-selections__item">陈海</li>
    </ul>
  </div>
</template>

<script>
import '@/assets/css/playing-view.css'
import Game from '@/libs/Game'
import Interlace from '@/libs/Interlace'
import Fire from '@/libs/Fire'

export default {
  interlace: null,

  mounted () {
    this.initFire()
    this.initGame()
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
            spark: this.spark.length > 10,
            spark2: true
          }
        }
      })
      fire.updatePosition(window.innerWidth * .5, window.innerWidth * 2)
      fire.start()
      this.$options.fire = fire
    },
    initGame () {
      this.initInterlace()
      window.game = new Game(this.$options.interlace)
      window.game.start()
    },
    initInterlace () {
      let interlaceEl = this.$refs.interlace
      let interlace = new Interlace(interlaceEl, {
        width: interlaceEl.clientWidth,
        height: interlaceEl.clientHeight,
        images: ['http://qiniu.jackyang.me/h5/image/face_qtw.jpg', 'http://qiniu.jackyang.me/h5/image/face_ldk.jpg']
      })
      interlace.init()
      this.$options.interlace = interlace
    }
  }
}
</script>
