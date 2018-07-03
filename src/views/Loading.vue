<template>
  <main class="c-loadingView">
    <canvas ref="canvas" class="c-canvas"></canvas>
    <img class="c-logo" src="~@/assets/images/logo_russia_2018_cup.png" />
    <h4 v-show="!loaded" class="c-percentage">{{percentage}}%</h4>
    <transition name="fade">
      <div v-show="loaded">
        <p class="c-tips">请选择难度开始游戏</p>
        <ul class="c-levels">
          <li @click="clickHandler('easy')" :class="{selected: selectLevel === 'easy'}">伪球迷 (EASY)</li>
          <li @click="clickHandler('hard')" :class="{selected: selectLevel === 'hard'}">资深球迷 (HARD)</li>
        </ul>
      </div>
    </transition>
  </main>
</template>

<script>
import Loader from 'resource-loader'
import Fire from '@/libs/Fire'
import IMAGES from '@/constants/images'

export default {
  fire: null,

  data () {
    return {
      percentage: 0,
      loaded: false,
      selectLevel: null
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
      
      Object.values(IMAGES).forEach(url => loader.add(url, url))

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
      this.selectLevel = level
      setTimeout(() => {
        this.$emit('start', level)
      }, 200)
    }
  }
}
</script>

<style scoped>
.c-loadingView {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  background-image: url(~@/assets/images/bg_red.jpg);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  text-align: center;
}
.c-logo {
  position: absolute;
  top: 33vh;
  left: 50%;
  transform: translateX(-50%);
  width: 10vh;
  z-index: 1;
}
.c-canvas {
  position: absolute;
  top: 4vh;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  width: 24vh;
  height: 40vh;
  z-index: 2;
}
.c-percentage {
  position: absolute;
  top: 54vh;
  left: 0;
  width: 100%;
  text-align: center;
  font-weight: 100;
  color: rgba(255,255,255,.7);
}
.c-tips {
  position: absolute;
  top: 56vh;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: rgba(255,255,255,.8);
}
.c-levels {
  position: absolute;
  left: 0;
  top: 64vh;
  width: 100%;
  display: inline-block;
  text-align: center;
  list-style: none;
  margin: 0;
  padding: 0;
}
.c-levels li {
  display: inline-block;
  width: 54vw;
  height: 13vw;
  line-height: 13vw;
  margin-bottom: 2vw;
  color: #fff;
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(~@/assets/images/txt_bg_blue_bordered.png);
  transition: all .3s ease;
}
.c-levels li.selected {
  color: #336295;
  background-image: url(~@/assets/images/txt_bg_white_bordered.png);
}
</style>