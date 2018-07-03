<template>
  <div class="c-playingView">
    <header class="c-header">
      <img class="c-playingView__logo" src="~@/assets/images/logo_russia_2018.png">
    </header>

    <div class="c-sniper">
      <!-- the mask -->
      <img class="c-sniper__aim" src="~@/assets/images/frame.png">
      <!-- the interlace area -->
      <div class="c-interlace" ref="interlace"></div>
]    </div>

    <!-- selections -->
    <ul class="c-playingView__selections">
      <li v-for="(item, i) in selections" :key="i" @click="checkAnswer($event, item.id)">
        <div class="c-selections__item">{{item.nameEN}}</div>
        <span class="c-selections__correct" v-show="showAnswer && answer === item.id && selected === item.id">Correct</span>
        <span class="c-selections__wrong" v-show="showAnswer && answer !== item.id && selected === item.id">Wrong</span>
      </li>
    </ul>
  </div>
</template>

<script>
import '@/assets/css/playing-view.css'
import Game from '@/libs/Game'
import Interlace from '@/libs/Interlace'

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
    this.initGame()
  },

  methods: {
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
      
      const { game } = window
      game.checkAnswer(id)
      this.selected = id
      this.showAnswer = true

      const endGame = () => {
        game.stop()
        this.$emit('end')
      }

      setTimeout(() => {
        if (this.answer !== id) {
          endGame()
        } else {
          if (game.hasMoreQuestion()) {
            this.nextQuestion()
          } else {
            endGame()
          }
        }
      }, 700)
    }
  }
}
</script>

<style scoped>
.c-header {
  position: relative;
  padding: 8px 16px 4px 16px;
  background: #336295;
}
</style>