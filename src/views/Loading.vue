<template>
  <main class="c-loadingView">
    <canvas ref="canvas" class="c-loadingView__canvas"></canvas>
    <h4 class="c-loadingView__percentage">{{percentage}}%</h4>
  </main>
</template>

<script>
import '@/assets/css/loading-view.css'
import GameData from '@/libs/GameData'
import Loader from 'resource-loader'
import Fire from '@/libs/Fire'

export default {
  fire: null,

  data () {
    return {
      percentage: 0
    }
  },

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
        loader.add(data.image, data.image, { crossOrigin: true }, resource => {
          data.image = resource.data
        })
      })

      ;[
        'http://qiniu.jackyang.me/h5/image/sniper_view.png',
        'http://qiniu.jackyang.me/h5/image/cloud_01.png',
        'http://qiniu.jackyang.me/h5/image/cloud_02.png',
        'http://qiniu.jackyang.me/h5/image/logo.png',
        'http://qiniu.jackyang.me/h5/image/logo_text.png',
        'http://qiniu.jackyang.me/h5/image/logo_text_small.png'
      ].forEach(url => {
        loader.add(url, url)
      })

      loader.onProgress.add(() => {
        this.percentage = Math.round(loader.progress)
      })
      loader.onComplete.add(() => {
        setTimeout(() => {
          this.$router.replace({ name: 'Welcome' })
        }, 500)
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
