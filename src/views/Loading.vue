<template>
  <main class="c-loadingView">
    <canvas ref="canvas" class="c-loadingView__canvas"></canvas>
    <h4 class="c-loadingView__percentage">13%</h4>
  </main>
</template>

<script>
import '@/assets/css/loading-view.css'
import Fire from '@/libs/Fire'

export default {
  fire: null,

  mounted () {
    this.initFire()
  },

  beforeDestroy () {
    setTimeout(() => {
      this.$options.fire.destroy()
    }, 300)
  },

  methods: {
    initFire () {
      let fire = new Fire(this.$refs.canvas, {
        width: 200,
        height: 300,
        enableMouseTrack: false,
        enableSpark: false,
        enableSpark2: false,
        skipFrame: function () {
    			return {
    				flame: this.flames.length > 3,
    				spark: this.spark.length > 6,
    				spark2: this.spark2.length > 2
    			}
    		}
      })
      fire.updatePosition(100, 260)
      fire.start()
      this.$options.fire = fire
    }
  }
}
</script>
