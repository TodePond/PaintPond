//========//
// USEFUL //
//========//
const clamp = (n, min, max) => {
	if (n < min) return min
	if (n > max) return max
	return n
}

//=========//
// PAINTER //
//=========//
const makePainter = ({
	source,
	offsetX = 0,
	offsetY = 0,
	scale = 1.0,
	speed = 0.1,
	maxSpeed = speed,
	minSpeed = maxSpeed * 0.3,
	acceleration = 0.001,
} = {}) => {
	const image = new Image()
	image.src = source
	const painter = {
		image,
		scale,
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		offsetX,
		offsetY,
		speed,
		maxSpeed,
		minSpeed,
		acceleration,
		isPainting: false,
		r: 0,
		dr: 0,
	}
	return painter
}

const drawPainter = (context, painter) => {
	const {image, scale, r} = painter
	const x = painter.x + painter.offsetX * scale
	const y = painter.y + painter.offsetY * scale
	const [width, height] = ["width", "height"].map(dimension => image[dimension] * scale)
	context.translate(x, y)
	context.rotate(r)
	context.drawImage(image, 0, 0, width, height)
	context.rotate(-r)
	context.translate(-x, -y)
}

const updatePainter = (painter, paths, colour) => {

	const acceleration = painter.acceleration * (Mouse.Right? -1 : 1)
	painter.speed = clamp(painter.speed + acceleration, painter.minSpeed, painter.maxSpeed)

	if (Mouse.Left) {
		if (!painter.isPainting) {
			painter.isPainting = true
			const path = new Path2D()
			paths.push(path)
			path.colour = colour
			path.moveTo(painter.x, painter.y)
		}
	} else {
		painter.isPainting = false
	}

	const [mx, my] = Mouse.position
	const mouse = {x: mx, y: my}

	const previous = {x: painter.x, y: painter.y, dx: painter.dx, dy: painter.dy}

	for (const position of ["x", "y"]) {
		const speed = `d${position}`
		if (mouse[position] === undefined) continue
		painter[speed] = (mouse[position] - painter[position]) * painter.speed
		painter[position] += painter[speed]
	}

	if (painter.isPainting) {
		const path = paths.last
		const angle = Math.atan2(previous.dx, previous.dy)
		const length = Math.hypot((previous.dx)/2, (previous.dy)/2) / 2
		const control = {x: length * Math.sin(angle), y: length * Math.cos(angle)}
		path.quadraticCurveTo(previous.x + control.x, previous.y + control.y, painter.x, painter.y)
		//path.lineTo(painter.x, painter.y)
	}

	painter.r = painter.dx * 0.01 + painter.dy * -0.01

}

//======//
// PATH //
//======//
const drawPaths = (context, paths) => {
	context.lineWidth = 10
	context.lineCap = "round"
	for (const path of paths) {
		context.strokeStyle = path.colour
		context.stroke(path)
	}
}

//--------------------- NO GLOBAL STATE ABOVE THIS LINE ---------------------//

//==============//
// GLOBAL STATE //
//==============//
const global = {
	painter: makePainter({
		source: "images/tode.png",
		scale: 0.5,
		offsetX: 0,
		offsetY: -65,
		speed: 0.1,
		minSpeed: 0.035,
	}),
	paths: [],
	colour: Colour.White,
}

//======//
// SHOW //
//======//
const show = Show.make()

show.resize = (context) => {
	context.canvas.style["background-color"] = Colour.Black
	context.canvas.style["cursor"] = "none"
}

show.tick = (context) => {
	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)

	updatePainter(global.painter, global.paths, global.colour)
	drawPaths(context, global.paths)
	drawPainter(context, global.painter)

}

//=======//
// EVENT //
//=======//
on.contextmenu(e => e.preventDefault(), {passive: false})

const KEYDOWN = {}
on.keydown(e => {
	const func = KEYDOWN[e.key]
	if (func === undefined) return
	func(e)
})

KEYDOWN["r"] = () => {
	global.paths = []
	global.painter.isPainting = false
}

KEYDOWN["1"] = () => global.colour = Colour.White
KEYDOWN["2"] = () => global.colour = Colour.Red
