import Interlace from './Interlace'
import random from 'lodash.random'

export default class Game {
  constructor (interlace) {
    this.interlace = interlace
    this.running = false
    this.vx = 1
    this.vy = 1

    this.position = {x: interlace.options.width / 2, y: interlace.options.height / 2}
    this.target = {x: interlace.options.width / 2, y: interlace.options.height / 2}
    this._init()
  }

  _init () {

  }

  _loop () {
    this._update()
    if (this.running) {
      requestAnimationFrame(this._loop.bind(this))
    }
  }

  _generateTarget () {
    let w = this.interlace.options.width
    let h = this.interlace.options.height
    this.target = {
      x: w / 2 + random(w / -8, w / 8),
      y: h / 2 + random(h / -8, h / 8)
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
    this._loop()
  }

  stop () {
    this.running = false
  }
}

const DATA = [
  { id: '001', name: '侯亮平', image: 'http://qiniu.jackyang.me/h5/image/face_hlp.jpg', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false },
  { id: '001', name: '', image: '', corrupt: false }
]

function generateQuestionList () {
  let questions = [] // {images: [], selections: [], answer: '001'}
}
