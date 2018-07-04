<template>
  <div class="c-playingView">
    <header class="c-header">
      <img class="c-logo" src="~@/assets/images/logo_russia_2018.png">
      <span class="c-tip">选择正确的球员名称</span>
    </header>

    <div class="c-wrapper">
      <!-- the mask -->
      <img class="c-frame" src="~@/assets/images/frame.png">
      <!-- the interlace area -->
      <div class="c-interlace" ref="interlace"></div>
]    </div>

    <!-- selections -->
    <ul class="c-selections">
      <li v-for="(item, i) in selections" :key="i" @click="checkAnswer($event, item.id)">
        <div :class="{'c-selections__item': true, 'selected': selected === item.id}">{{level === 'hard' ? item.nameEN : item.nameCN}}</div>
        <span class="c-selections__correct" v-show="showAnswer && answer === item.id && selected === item.id">Correct</span>
        <span class="c-selections__wrong" v-show="showAnswer && answer !== item.id && selected === item.id">Wrong</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Game from '@/libs/Game'
import Interlace from '@/libs/Interlace'

export default {
  interlace: null,

  props: {
    level: String
  },

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
        this.selected = null
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
.c-playingView {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url(~@/assets/images/bg_blue.jpg);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.c-header {
  position: relative;
  padding: 8px 16px 4px 16px;
}

.c-logo {
  width: 54px;
  height: 54px;
}

.c-tip {
  position: absolute;
  right: 10px;
  bottom: 8px;
  color: rgba(255,255,255,.9);
  font-size: 14px;
}

.c-wrapper {
  position: relative;
  padding: 5px;
  width: 100vw;
  height: 100vw;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
}
.c-frame {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 101%;
  height: 101%;
  z-index: 10;
}
.c-interlace {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* selections */
.c-selections {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-top: 8vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.c-selections li {
  position: relative;
}
.c-selections__item {
  display: inline-block;
  width: 42vw;
  height: 11vw;
  line-height: 11vw;
  margin: 3vw 2vw;
  text-align: center;
  color: rgba(255,255,255,.8);
  box-sizing: border-box;
  transition: all .3s ease;
  background-image: url(~@/assets/images/txt_bg_blue_bordered.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}
.c-selections__item.selected {
  color: #336295;
  background-image: url(~@/assets/images/txt_bg_white_bordered.png);
}
.c-selections__correct {
  position: absolute;
  top: 14vw;
  right: 4vw;
  display: block;
  font-size: 14px;
  color: #2ce465;
}
.c-selections__wrong {
  position: absolute;
  top: 14vw;
  right: 4vw;
  display: block;
  font-size: 14px;
  color: red;
}
</style>