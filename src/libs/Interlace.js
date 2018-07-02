export default class Interlace {
  constructor (el, options) {
    let defaultOptions = {
      width: 400,
      height: 400,
      images: []
    }

    options || (options = {})
    this.options = {}
    for (let p in defaultOptions) {
      if (options[p] !== null && options[p] !== undefined) {
        this.options[p] = options[p]
      } else {
        this.options[p] = defaultOptions[p]
      }
    }

    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.canvas = null
    this.context = null

    this.images = []
    this.cells = []
    this.intersections = [[this.options.width / 2, this.options.height / 2]]

    this._init()
  }

  _init () {
    this._initCanvas()
    this._loadImages(this.options.images)
  }

  _initCanvas () {
    let canvas = document.createElement('canvas')
    canvas.width = this.options.width
    canvas.height = this.options.height
    canvas.style.width = this.options.width + 'px'
    canvas.style.height = this.options.height + 'px'
    this.el.innerHTML = ''
    this.el.appendChild(canvas)
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  }

  _loadImages (images) {
    if (images.length > 0 && images[0] instanceof window.Image) {
      this.images = images
      this.update(this.intersections)
    } else {
      this.images = images.map(image => {
        const img = new Image()
        img.crossOrigin = true
        img.onload = this._handleImageLoaded.bind(this)
        img.src = image
        return img
      })
    }
  }

  _handleImageLoaded () {
    if (this.images.filter(image => !image.complete).length === 0) {
      this.update(this.intersections)
    }
  }

  _calculateCells () {
    // ascend sort of intersections values
    let points = [[0, 0]].concat(this.intersections).concat([[this.options.width, this.options.height]])
    let xValues = points.map(p => p[0]).sort((v1, v2) => { return v1 - v2})
    let yValues = points.map(p => p[1]).sort((v1, v2) => { return v1 - v2})

    this.cells = []

    for (let row = 0; row < this.intersections.length + 1; row ++) { // x
      for (let col = 0; col < this.intersections.length + 1; col ++) { // y
        this.cells.push({
          top: yValues[row],
          left: xValues[col],
          width: xValues[col + 1] - xValues[col],
          height: yValues[row + 1] - yValues[row],
          primary: (row + col) % 2 === 0
        })
      }
    }
  }

  _renderCells () {
    this.cells.forEach((cell, i) => {
      this._draw(cell)
    })
  }

  _draw  (cell) {
    if (this.images.length === 0) {
      return
    }

    let image = this.images.length === 1 ? this.images[0] : (cell.primary ? this.images[0] : this.images[1])
    let widthRatio = image.naturalWidth / this.options.width
    let heightRatio = image.naturalHeight / this.options.height
    let sx = cell.left * widthRatio
    let sy = cell.top * heightRatio
    let sWidth = image.naturalWidth - sx
    let sHeight = image.naturalHeight - sy

    // sx + swidth <= naturalWidth
    // sy + sheight <= naturalHeight
    // or ios can't drawImage
    // convert: 250, 0, canvasWidth, canvasHeight => 250, 0, canvasWidth / 2, canvasHeight

    /* this works anywhere else than ios */
    /* this.context.drawImage(
      image,
      cell.left * widthRatio, cell.top * heightRatio
      image.naturalWidth, image.naturalHeight,
      cell.left, cell.top,
      this.options.width, this.options.height
    ) */

    /* this works everywhere */
    this.context.drawImage(
      image,
      sx, sy,
      sWidth, sHeight,
      cell.left, cell.top,
      this.options.width * sWidth / image.naturalWidth, this.options.height * sHeight / image.naturalHeight
    )
  }

  setImages (images) {
    this._loadImages(images)
  }

  update (points) {
    this.intersections = points
    this._calculateCells()
    this._renderCells()
  }
}
