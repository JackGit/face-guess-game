<template>
  <div class="c-resultView">
    <div class="c-top" :style="{backgroundImage:`url(${pic})`}">
    </div>
    <div class="c-bottom">
      <p class="c-text">游戏结束，您识别出了{{count}}名球员</p>
      <span class="c-btn" @click="clickHandler">再来一次</span>
    </div>
  </div>
</template>

<script>
import { PICS } from '@/constants/images'
import random from 'lodash.random'
const picKeys = Object.keys(PICS)

export default {
  data () {
    return {
      pic: PICS[picKeys[random(0, picKeys.length - 1)]],
      count: window.game.result.length - 1
    }
  },

  methods: {
    clickHandler () {
      this.$emit('again')
    }
  }
}
</script>

<style scoped>
.c-top {
  width: 100%;
  height: 80vh;
  background: #336295;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(~@/assets/images/pic_01.jpg);
}
.c-bottom {
  position: relative;
  width: 100%;
  height: 20vh;
  background: #336295;
  background-image: url(~@/assets/images/bg_blue.jpg);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  font-weight: bold;
}
.c-text {
  position: absolute;
  top: 6vh;
  left: 0;
  width: 100%;
  text-align: center;
}
.c-btn {
  position: absolute;
  top: -6vw;
  left: 25vw;
  display: inline-block;
  width: 50vw;
  height: 12vw;
  color: #336295;
  text-align: center;
  line-height: 12vw;
  background-image: url(~@/assets/images/txt_bg_white.png);
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>