<template>
  <div class="c-playingView">
    <header class="c-playingView__header">
      <img class="c-playingView__logo" src="~@/assets/images/logo_russia_2018.png">
    </header>

    <div class="c-sniper">
      <!-- the mask
      <img class="c-sniper__aim" src="../assets/images/sniper_view.png">
      -->
      <!-- the interlace area -->
      <div class="c-interlace" ref="interlace"></div>
]    </div>

    <!-- selections -->
    <ul :class="{'c-playingView__selections': true, 'is-reveal': showAnswer}">
      <li :class="{'c-selections__item': true, 'correct': answer === item.id && selected === item.id, 'wrong': answer !== item.id && selected === item.id}"
          v-for="(item, i) in selections"
          :key="i"
          @click="checkAnswer($event, item.id)">{{item.name}}</li>
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
