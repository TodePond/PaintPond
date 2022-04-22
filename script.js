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
	sources,
	offsetX = 0,
	offsetY = 0,
	scale = 1.0,
	speed = 0.1,
	maxSpeed = speed,
	minSpeed = maxSpeed * 0.3,
	acceleration = 0.001,
	dr = 0.05,
	frameRate = 24,
} = {}) => {

	const images = []
	for (const source of sources) {
		const image = new Image()
		image.src = source
		images.push(image)
	}

	const painter = {
		images,
		frame: 0,
		frameRate,
		age: 0,
		scale,
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		dr,
		offsetX,
		offsetY,
		speed,
		maxSpeed,
		minSpeed,
		acceleration,
		isPainting: false,
		brushdx: 0,
		brushdy: 0,
		r: 0,
	}
	return painter
}

const drawPainter = (context, painter) => {
	const {images, frame, scale, r} = painter
	const image = images[frame]
	const [width, height] = ["width", "height"].map(dimension => image[dimension] * scale)

	const center = {x: painter.x + width/2, y: painter.y + height/2}

	context.translate(center.x, center.y)
	context.rotate(r)
	context.drawImage(image, -width/2, -height/2, width, height)
	context.rotate(-r)
	context.translate(-center.x, -center.y)
}

// https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
function rotatePoint (cx, cy, x, y, angle) {
    const cos = Math.cos(-angle)
    const sin = Math.sin(-angle)
    const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx
    const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
    return {x: nx, y: ny}
}

const getBrushPosition = (painter) => {
	const image = painter.images[painter.frame]
	const x = painter.x - painter.offsetX * painter.scale
	const y = painter.y - painter.offsetY * painter.scale
	const cx = painter.x + image.width/2 * painter.scale
	const cy = painter.y + image.height/2 * painter.scale
	return rotatePoint(cx, cy, x, y, painter.r)
}

const updatePainter = (painter, paths, colour) => {

	painter.age++
	if (painter.age > 255) {
		painter.age = 0
	}
	if (painter.age % (60 / painter.frameRate) === 0) {
		painter.frame++
		if (painter.frame >= painter.images.length) {
			painter.frame = 0
		}
	}

	const acceleration = painter.acceleration * (Mouse.Right? -1 : 1)
	painter.speed = clamp(painter.speed + acceleration, painter.minSpeed, painter.maxSpeed)

	const brush = getBrushPosition(painter)

	if (Mouse.Left) {
		if (!painter.isPainting) {
			painter.isPainting = true
			const path = new Path2D()
			paths.push(path)
			path.colour = colour
			path.moveTo(brush.x, brush.y)
		}
	} else {
		painter.isPainting = false
	}

	const [mx, my] = Mouse.position
	const mouse = {x: mx, y: my}

	const previous = {x: brush.x, y: brush.y, dx: painter.brushdx, dy: painter.brushdy}

	for (const position of ["x", "y"]) {
		const speed = `d${position}`
		if (mouse[position] === undefined) continue
		painter[speed] = (mouse[position] - painter[position]) * painter.speed
		painter[position] += painter[speed]
	}

	painter.r = painter.dx * painter.dr + painter.dy * -painter.dr

	const newBrush = getBrushPosition(painter)

	painter.brushdx = newBrush.x - brush.x
	painter.brushdy = newBrush.y - brush.y
	
	if (painter.isPainting) {
		const path = paths.last
		const angle = Math.atan2(previous.dx, previous.dy)
		const length = Math.hypot((previous.dx / 2), (previous.dy / 2)) / 2
		const control = {x: length * Math.sin(angle), y: length * Math.cos(angle)}
		path.quadraticCurveTo(previous.x + control.x, previous.y + control.y, newBrush.x, newBrush.y)
		//path.lineTo(painter.x, painter.y)
	}

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
		sources: ["images/berd0.png", "images/berd1.png"],
		scale: 0.5,
		offsetX: -25,
		offsetY: -107.5,
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
