import objectAssign from 'object-assign'

function Fire (canvasEl, options) {
	var defaultOptions = {
		width: 400,
		height: 400,
		enableMouseTrack: true,
		enableFlame: true,
		enableSpark: true,
		enableSpark2: true,
		skipFrame: function () {
			return {
				flame: false,
				spark: false,
				spark2: false
			}
		}
	}

	this.options = objectAssign({}, defaultOptions, options || {})
	this.canvas = typeof canvasEl === 'string' ? document.querySelector(canvasEl) : canvasEl
	this.ctx = this.canvas.getContext('2d')
	this.canvas.width = this.options.width
	this.canvas.height = this.options.height

	this.flames = []
	this.spark = []
	this.spark2 = []

	this.position = {
		x : this.canvas.width * .5,
		y : this.canvas.height * .75
	}

	this.running = false
	this._init()
}

Fire.prototype._init = function () {
	if (this.options.enableMouseTrack) {
		this.canvas.addEventListener('mousemove', function (e) {
			this.updatePosition(e.clientX, e.clientY)
		}.bind(this), false)
	}
}

Fire.prototype._run = function () {
	this._update()
	this._draw()

	if (this.running) {
		requestAnimationFrame(this._run.bind(this))
	}
}

Fire.prototype._clearCanvas = function () {
	this.ctx.clearRect(0, 0, this.options.width, this.options.height)
}

Fire.prototype._update = function () {
	var skipFrame = this.options.skipFrame ? this.options.skipFrame.bind(this)() : { flame: false, spark: false, spark2: false }
	this.options.enableFlame && !skipFrame.flame && this.flames.push(new Flame(this.position))
	this.options.enableSpark && !skipFrame.spark && this.spark.push(new Spark(this.position))
	this.options.enableSpark2 && !skipFrame.spark2 && this.spark2.push(new Spark(this.position))

	for (var i = this.flames.length - 1; i >= 0; i--) {
		if (this.flames[i].alive) {
			this.flames[i]._update()
		} else {
			this.flames.splice(i, 1)
		}
	}

	for (var i = this.spark.length - 1; i >= 0; i--) {
		if (this.spark[i].alive) {
			this.spark[i]._update()
		} else {
			this.spark.splice(i, 1)
		}
	}

	for (var i = this.spark2.length - 1; i >= 0; i--) {
		if (this.spark2[i].alive) {
			this.spark2[i]._update()
		} else {
			this.spark2.splice(i, 1)
		}
	}
}

Fire.prototype._draw = function () {
	this._clearCanvas()

	this.ctx.globalCompositeOperation = 'overlay'
	for (var i = this.flames.length - 1; i >= 0; i--) {
		this.flames[i]._draw(this.ctx)
	}

	this.ctx.globalCompositeOperation = 'color-dodge'
	for (var i = this.spark.length - 1; i >= 0; i--) {
		this.spark[i]._draw(this.ctx)
	}

	this.ctx.globalCompositeOperation = 'soft-light'
	for (var i = this.spark2.length - 1; i >= 0; i--) {
		if ((i % 2) === 0) {
			this.spark2[i]._draw(this.ctx)
		}
	}
}

Fire.prototype.updatePosition = function (x, y) {
	this.position.x = x
	this.position.y = y
}

Fire.prototype.start = function () {
	this.running = true
	this._run()
}

Fire.prototype.stop = function () {
	this.running = false
}

Fire.prototype.destroy = function () {
	this.stop()
	this.flames = []
	this.spark = []
	this.spark2 = []
}

function Flame (position) {
	this.cx = position.x
	this.cy = position.y
	this.x = rand(this.cx - 25, this.cx + 25)
	this.y = rand(this.cy - 5, this.cy + 5)
	this.lx = this.x
	this.ly = this.y
	this.vy = rand(1, 3)
	this.vx = rand(-1, 1)
	this.r = rand(Flame.SIZE[0], Flame.SIZE[1])
	this.life = rand(Flame.LIFE[0], Flame.LIFE[1])
	this.alive = true
	this.c = {
		h : Math.floor(rand(2, 40)),
		s : 100,
		l : rand(50, 100),
		a : 0,
		ta : rand(0.8, 0.9)
	}
}

Flame.SIZE = [30, 40]
Flame.LIFE = [2, 7]
Flame.LIFE_DECS_FACTOR = .18

Flame.prototype._update = function () {
	this.lx = this.x
	this.ly = this.y
	this.y -= this.vy
	this.vy += 0.08
	this.x += this.vx

	if (this.x < this.cx) {
		this.vx += 0.2
	} else {
		this.vx -= 0.2
	}

	if (this.r > 0) {
		this.r -= 0.3
	}

	if(this.r <= 0) {
		this.r = 0
	}

	this.life -= Flame.LIFE_DECS_FACTOR

	if(this.life <= 0) {
		this.c.a -= 0.05
		if (this.c.a <= 0) {
			this.alive = false
		}
	} else if (this.life > 0 && this.c.a < this.c.ta) {
		this.c.a += .08
	}
}

Flame.prototype._draw = function (ctx) {
	this.grd1 = ctx.createRadialGradient(this.x, this.y, this.r * 3, this.x, this.y, 0)
	this.grd1.addColorStop(0.5, 'hsla(' + this.c.h + ', ' + this.c.s + '%, ' + this.c.l + '%, ' + (this.c.a / 20) + ')')
	this.grd1.addColorStop(0, 'transparent')

	this.grd2 = ctx.createRadialGradient( this.x, this.y, this.r, this.x, this.y, 0)
	this.grd2.addColorStop(0.5, 'hsla(' + this.c.h + ', ' + this.c.s + '%, ' + this.c.l + '%, ' + this.c.a + ')')
	this.grd2.addColorStop(0, 'transparent')

	ctx.beginPath()
	ctx.arc(this.x, this.y, this.r * 3, 0, 2 * Math.PI)
	ctx.fillStyle = this.grd1
	ctx.fill()

	ctx.globalCompositeOperation = 'overlay'
	ctx.beginPath()
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
	ctx.fillStyle = this.grd2
	ctx.fill()

	ctx.beginPath()
	ctx.moveTo( this.lx , this.ly)
	ctx.lineTo( this.x, this.y)
	ctx.strokeStyle = 'hsla(' + this.c.h + ', ' + this.c.s + '%, ' + this.c.l + '%, 1)'
	ctx.lineWidth = rand(1, 2)
	ctx.stroke()
	ctx.closePath()
}

function Spark (position) {
	this.cx = position.x
	this.cy = position.y
	this.x = rand(this.cx - 40, this.cx + 40)
	this.y = rand(this.cy, this.cy + 5)
	this.lx = this.x
	this.ly = this.y
	this.vy = rand(1, 2)
	this.vx = rand(-8, 8) // rand(-4, 4)
	this.r = rand(0, 5) // rand(0, 1)
	this.life = rand(4, 8)
	this.alive = true
	this.c = {
		h: Math.floor(rand(2, 30)),
		s: 100,
		l: rand(40, 60),
		a: rand(0.8, 0.9)
	}
}

Spark.prototype._update = function () {
	this.lx = this.x
	this.ly = this.y
	this.y -= this.vy
	this.x += this.vx

	// rotate (drift left and right)
	if (this.x < this.cx) {
		this.vx += 0.03 // .2
	} else {
		this.vx -= 0.03 // .2
	}

	// go up
	this.vy += 0.01 // .08

	// decrease life
	this.life -= 0.03 // .1

	// once life ended, decrease the alpha channel
	if (this.life <= 0) {
		this.c.a -= 0.05
		// once alpha channel less or equal 0, set as inactive
		if (this.c.a <= 0) {
			this.alive = false
		}
	}
}

Spark.prototype._draw = function (ctx) {
	ctx.beginPath()
	ctx.moveTo(this.lx , this.ly)
	ctx.lineTo(this.x, this.y)
	ctx.strokeStyle = 'hsla(' + this.c.h + ', ' + this.c.s + '%, ' + this.c.l + '%, ' + (this.c.a / 2) + ')'
	ctx.lineWidth = this.r * 2
	ctx.lineCap = 'round'
	ctx.stroke()
	ctx.closePath()

	ctx.beginPath()
	ctx.moveTo(this.lx , this.ly)
	ctx.lineTo(this.x, this.y)
	ctx.strokeStyle = 'hsla(' + this.c.h + ', ' + this.c.s + '%, ' + this.c.l + '%, ' + this.c.a + ')'
	ctx.lineWidth = this.r
	ctx.stroke()
	ctx.closePath()
}

function rand (min, max) { return Math.random() * ( max - min) + min }

export default Fire
