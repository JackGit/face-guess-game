<template>
  <main class="c-loadingView">
    <canvas ref="canvas" class="c-loadingView__canvas"></canvas>
    <h4 class="c-loadingView__percentage">13%</h4>
  </main>
</template>

<script>
import '@/assets/css/loading-view.css'
import GameData from '@/libs/GameData'
import Loader from 'resource-loader'
import Fire from '@/libs/Fire'

export default {
  fire: null,

  mounted () {
    this.initLoader()
    this.initFire()
  },

  beforeDestroy () {
    setTimeout(() => {
      this.$options.fire.destroy()
    }, 300)
  },

  methods: {
    initLoader () {
      let loader = new Loader()

      GameData.forEach(data => {
        loader.add('IMG_' + data.id, data.image, { crossOrigin: true })
      })
      loader.onProgress.add(() => {
        console.log(loader.progress)
      })
      loader.onComplete.add(() => {
        setTimeout(_ => this.$router.push({ name: 'Welcome' }, 500))
      })
      loader.load()

      window.loader = loader
    },
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
    				spark: true,
    				spark2: true
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
