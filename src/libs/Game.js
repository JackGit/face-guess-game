import Interlace from './Interlace'
import DATA from './GameData'
import random from 'lodash.random'
import sampleSize from 'lodash.samplesize'
import shuffle from 'lodash.shuffle'

export default class Game {
  constructor (interlace) {
    this.interlace = interlace
    this.running = false
    this.vx = 1
    this.vy = 1

    this.position = {x: interlace.options.width / 2, y: interlace.options.height / 2}
    this.target = {x: interlace.options.width / 2, y: interlace.options.height / 2}

    this.questions = []
    this.currentQuestionIndex = -1
    this.result = []

    this._init()
  }

  _init () {
    this.questions = generateQuestionList(5)
    this._loop()
  }

  _loop () {
    if (this.running) {
      this._update()
    }
    requestAnimationFrame(this._loop.bind(this))
  }

  _generateTarget () {
    let w = this.interlace.options.width
    let h = this.interlace.options.height
    this.target = {
      x: w / 2 + random(w / -12, w / 12),
      y: h / 2 + random(h / -12, h / 12)
    }
  }

  _reachTarget () {
    return Math.abs(this.target.x - this.position.x) < 1 && Math.abs(this.target.y - this.position.y) < 1
  }

  _update () {
    if (this._reachTarget()) {
      this._generateTarget()
    }
    this._move()
  }

  _center () {
    let p = [this.interlace.options.width / 2, this.interlace.options.height / 2]
    this.interlace.update([p])
    this._translate(p)
  }

  _move () {
    let point = [
      this.position.x += this.vx * Math.sign(this.target.x - this.position.x),
      this.position.y += this.vy * Math.sign(this.target.y - this.position.y)
    ]
    this.interlace.update([point])
    this._translate(point)
  }

  _translate (point) {
    let x = this.interlace.options.width / 2 - point[0]
    let y = this.interlace.options.height / 2 - point[1]
    this.interlace.el.style.transform = `translateX(${x}px) translateY(${y}px)`
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
    let question = this.currentQuestion()
    if (question.answer === selection) {
      this.result.push(true)
    } else {
      this.result.push(false)
    }

    this.stop()

    // display the answer image
    let image = DATA.filter(d => d.id === question.answer)[0].image
    this.interlace.setImages([image])
    this._center()
  }
}

function generateQuestionList (size) {
  let questions = [] // {images: [], selections: [ {name, id}], answer: '001'}
  let goodGuys = DATA.filter(d => !d.corrupt)
  let badGuys = DATA.filter(d => d.corrupt)

  for (let i = 0; i < size; i ++) {
    let target = sampleSize(badGuys.filter(guy => {
      // not in question list
      return questions.filter(q => q.answer === guy.id).length === 0
    }), 1)[0]
    let other = sampleSize(goodGuys, 1)[0]
    let images = [target.image, other.image]
    let selections = [{ name: target.name, id: target.id }, { name: other.name, id: other.id }]

    sampleSize(DATA.filter(d => d.id !== target.id && d.id !== other.id), 2).forEach(d => selections.push({
      name: d.name,
      id: d.id
    }))

    questions.push({
      images,
      selections: shuffle(selections),
      answer: target.id
    })
  }
  return shuffle(questions)
}
