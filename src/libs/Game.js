import DATA from '@/constants/game'
import random from 'lodash.random'
import sampleSize from 'lodash.samplesize'
import shuffle from 'lodash.shuffle'

export default class Game {
  constructor (interlace) {
    this.interlace = interlace
    this.running = false
    this.vx = this.vy = 1

    this.position = {x: interlace.options.width / 2, y: interlace.options.height / 2}
    this.target = {x: interlace.options.width / 2, y: interlace.options.height / 2}

    this.questions = []
    this.currentQuestionIndex = -1
    this.result = []

    this._init()
  }

  _init () {
    this.questions = generateQuestionList(10)
    this._loop()
  }

  _loop () {
    if (this.running) {
      this._update()
    }
    requestAnimationFrame(this._loop.bind(this))
  }

  _generateTarget () {
    const w = this.interlace.options.width
    const h = this.interlace.options.height
    this.target = {
      x: w / 2 + random(w / -5, w / 5),
      y: h / 2 + random(h / -5, h / 5)
    }
  }

  _reachTarget () {
    return Math.abs(this.target.x - this.position.x) <= this.vx && Math.abs(this.target.y - this.position.y) <= this.vy
  }

  _update () {
    if (this._reachTarget()) {
      this._generateTarget()
    }
    this._move()
  }

  _center () {
    const p = [this.interlace.options.width / 2, this.interlace.options.height / 2]
    this.interlace.update([p])
    this._translate(p)
  }

  _move () {
    this.position.x = Math.abs(this.target.x - this.position.x) > this.vx
      ? this.position.x + this.vx * Math.sign(this.target.x - this.position.x)
      : this.position.x
    this.position.y = Math.abs(this.target.y - this.position.y) > this.vy
      ? this.position.y + this.vy * Math.sign(this.target.y - this.position.y)
      : this.position.y
    const point = [this.position.x, this.position.y]

    this.interlace.update([point])
    this._translate(point)
  }

  _translate (point) {
    const x = this.interlace.options.width / 2 - point[0]
    const y = this.interlace.options.height / 2 - point[1]
    this.interlace.el.style.transform = `translateX(${x}px) translateY(${y}px)`
  }

  _updateSpeed () {
    const pace = .5
    const last = this.vx
    this.vx = this.vy = last + pace
  }

  start () {
    this.running = true
  }

  stop () {
    this.running = false
  }

  nextQuestion () {
    if (this.currentQuestionIndex === this.questions.length - 1) {
      console.warn('no more next question')
      return
    } else {
      let question = this.questions[++ this.currentQuestionIndex]
      this.stop()
      this.interlace.setImages(question.images)
      this._updateSpeed()
      this.start()
      return question
    }
  }

  hasMoreQuestion () {
    return this.currentQuestionIndex < this.questions.length - 1
  }

  currentQuestion () {
    return this.questions[this.currentQuestionIndex]
  }

  clearResult () {
    this.result = []
  }

  checkAnswer (selection) {
    const question = this.currentQuestion()
    if (question.answer === selection) {
      this.result.push(true)
    } else {
      this.result.push(false)
    }

    this.stop()

    // display the answer image
    const image = DATA.filter(d => d.id === question.answer)[0].image
    this.interlace.setImages([image])
    this._center()
  }
}

/**
 * generate questions of size:
 * [{ images: [], selections: [{ nameCN, nameEN, id }], answer: '001' }]
 */
const generateQuestionList = (size) => {
  const answerIds = sampleSize(DATA, size).map(item => item.id)
  const questions = answerIds.map(answerId => {
    const rest = DATA.filter(d => d.id !== answerId)
    const answer = DATA.find(d => d.id === answerId)
    const confuseAnswer = sampleSize(rest, 1)[0]

    const selections = [
      answer,
      ...sampleSize(DATA.filter(d => d.id !== answer.id && d.id !== confuseAnswer.id), 3)
    ]

    return {
      images: [answer.image, confuseAnswer.image],
      selections: shuffle(selections),
      answer: answerId
    }
  })

  return shuffle(questions)
}
