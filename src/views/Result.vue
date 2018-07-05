<template>
  <div class="c-resultView">
    <vue-img-loader
      :src="pic"
      :width="imgWidth"
      :height="imgHeight"
      :preview="preview"
      center-type="cover"
      transition="fade2"
    />
    <div class="c-bottom">
      <p class="c-text" v-if="allRight">恭喜，您识别出了所有{{count}}名球员！</p>
      <p class="c-text" v-else>游戏结束，您识别出了{{count}}名球员</p>
      <span class="c-btn" @click="clickHandler">再来一次</span>
    </div>
  </div>
</template>

<script>
import { PICS } from '@/constants/images'
import VueImgLoader from 'vue-img-loader'
import random from 'lodash.random'

const picKeys = Object.keys(PICS)

export default {
  components: {
    VueImgLoader
  },
  
  data () {
    const pic = PICS[picKeys[random(0, picKeys.length - 1)]]
    const count = window.game.result.filter(r => r).length
    return {
      preview: `${pic}?imageView2/1/w/100`,
      pic,
      count,
      imgWidth: window.innerWidth,
      imgHeight: window.innerHeight * .8,
      allRight: count === window.game.questions.length
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
.c-resultView {
  font-size: 0;
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
  font-size: 16px;
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