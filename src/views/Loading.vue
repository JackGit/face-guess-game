<template>
  <main class="c-loadingView">
    <canvas ref="canvas" class="c-loadingView__canvas"></canvas>
    <h4 v-show="!loaded" class="c-loadingView__percentage">{{percentage}}%</h4>
    <div v-show="loaded">
      <button @click="clickHandler"></button>
      <ul>
        <li @click="clickHandler(1)">伪球迷</li>
        <li @click="clickHandler(2)">资深球迷</li>
      </ul>
    </div>
  </main>
</template>

<script>
import '@/assets/css/loading-view.css'
import GameData from '@/constants/game'
import Loader from 'resource-loader'
import Fire from '@/libs/Fire'

export default {
  fire: null,

  data () {
    return {
      percentage: 0,
      loaded: false
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
      const loader = new Loader()

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
          this.loaded = true
        }, 500)
      })
      loader.load()

      window.loader = loader
    },
    initFire () {
      const fire = new Fire(this.$refs.canvas, {
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
    },
    clickHandler (level) {
      this.$emit('start', level)
    }
  }
}
</script>
