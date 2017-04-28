function Interlace (el, options) {
  var defaultOptions = {
    width: 400,
    height: 400,
    images: []
  }

  options || (options = {})
  this.options = {}
  for (var p in defaultOptions) {
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
}

Interlace.prototype.init = function () {
  this._loadImages(this.options.images)
  this._initCanvas()
}

Interlace.prototype._initCanvas = function () {
  var canvas = document.createElement('canvas')
  canvas.width = this.options.width
  canvas.height = this.options.height
  canvas.style.width = this.options.width + 'px'
  canvas.style.height = this.options.height + 'px'
  this.el.innerHTML = ''
  this.el.appendChild(canvas)
  this.canvas = canvas
  this.context = canvas.getContext('2d')
}

Interlace.prototype._loadImages = function (images) {
  this.images = images.map(function (image) {
    var img = new Image()
    img.crossOrigin = true
    img.onload = this._handleImageLoaded.bind(this)
    img.src = image
    return img
  }, this)
}

Interlace.prototype._handleImageLoaded = function () {
  if (this.images.filter(function (image) { return !image.complete }).length === 0) {
    this.update(this.intersections)
  }
}

Interlace.prototype._calculateCells = function () {
  // ascend sort of intersections values
  var points = [[0, 0]].concat(this.intersections).concat([[this.options.width, this.options.height]])
  var xValues = points.map(function (p) { return p[0] }).sort(function (v1, v2) { return v1 - v2})
  var yValues = points.map(function (p) { return p[1] }).sort(function (v1, v2) { return v1 - v2})

  this.cells = []

  for (var row = 0; row < this.intersections.length + 1; row ++) { // x
    for (var col = 0; col < this.intersections.length + 1; col ++) { // y
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

Interlace.prototype._renderCells = function () {
  this.cells.forEach(function (cell, i) {
    this._draw(cell)
  }, this)
}

Interlace.prototype._draw = function (cell) {
  var image = cell.primary ? this.images[0] : this.images[1]
  var widthRatio = image.naturalWidth / this.options.width
  var heightRatio = image.naturalHeight / this.options.height
  var sx = cell.left * widthRatio
  var sy = cell.top * heightRatio
  var sWidth = image.naturalWidth - sx
  var sHeight = image.naturalHeight - sy

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

Interlace.prototype.setImages = function (images) {
  this._loadImages(images)
}

Interlace.prototype.update = function (points) {
  this.intersections = points
  this._calculateCells()
  this._renderCells()
}

module.exports = Interlace
