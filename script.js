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
	}
	return painter
}

const drawPainter = (context, painter) => {
	const {scale, image} = painter
	const x = painter.x + painter.offsetX * scale
	const y = painter.y + painter.offsetY * scale
	const [width, height] = ["width", "height"].map(dimension => image[dimension] * scale)
	context.drawImage(image, x, y, width, height)
}

const updatePainter = (painter) => {

	const acceleration = painter.acceleration * (Mouse.Right? -1 : 1)
	painter.speed = clamp(painter.speed + acceleration, painter.minSpeed, painter.maxSpeed)

	const [mx, my] = Mouse.position
	const mouse = {x: mx, y: my}

	for (const position of ["x", "y"]) {
		const speed = `d${position}`
		if (mouse[position] === undefined) continue
		painter[speed] = (mouse[position] - painter[position]) * painter.speed
		painter[position] += painter[speed]
	}

}

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
		minSpeed: 0.05,
	}),
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

	updatePainter(global.painter)
	drawPainter(context, global.painter)

}

on.contextmenu(e => e.preventDefault(), {passive: false})

