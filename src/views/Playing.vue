<template>
  <div class="c-playingView">
    <header class="c-playingView__header">
      <img class="c-playingView__logo" src="http://qiniu.jackyang.me/h5/image/logo_text_small.png">
    </header>

    <div class="c-sniper">
      <!-- the mask -->
      <img class="c-sniper__aim" src="http://qiniu.jackyang.me/h5/image/sniper_view.png">
      <!-- the interlace area -->
      <div class="c-interlace" ref="interlace"></div>
      <!-- cloud -->
      <img src="http://qiniu.jackyang.me/h5/image/cloud_02.png" class="c-sniper__cloud">
      <!-- spark -->
      <canvas ref="canvas" class="c-sniper__spark"></canvas>
    </div>

    <!-- selections -->
    <ul :class="{'c-playingView__selections': true, 'is-reveal': showAnswer}">
      <li :class="{'c-selections__item': true, 'correct': answer === item.id && selected === item.id, 'wrong': answer !== item.id && selected === item.id}"
          v-for="item in selections"
          @click="checkAnswer($event, item.id)">{{item.name}}</li>
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

  data () {
    return {
      selections: [],
      selected: null,
      answer: null,
      showAnswer: false
    }
  },

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
            spark: this.spark.length > 20,
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
      window.game.clearResult()
      this.nextQuestion()
    },
    initInterlace () {
      let interlaceEl = this.$refs.interlace
      let interlace = new Interlace(interlaceEl, {
        width: interlaceEl.clientWidth,
        height: interlaceEl.clientHeight
      })
      this.$options.interlace = interlace
    },
    nextQuestion () {
      let question = window.game.nextQuestion()
      this.showAnswer = false
      this.selections = question.selections
      this.answer = question.answer
    },
    checkAnswer (event, id) {
      if (this.showAnswer) {
        return
      }
      
      let game = window.game
      game.checkAnswer(id)
      this.selected = id
      this.showAnswer = true

      setTimeout(() => {
        if (game.hasMoreQuestion()) {
          this.nextQuestion()
        } else {
          game.stop()
          this.$router.replace({ name: 'Result' })
        }
      }, 700)
    }
  }
}
</script>
