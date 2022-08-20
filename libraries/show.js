const Show = {}

{

	Show.make = ({canvas, context, paused = false, scale = 1.0, aspect, speed = 1.0, resize = () => {}, tick = () => {}, supertick = () => {}} = {}) => {
		
		const show = {canvas, context, paused, scale, speed, resize, tick, supertick}

		if (document.body === null) {
			addEventListener("load", () => start(show))
		} else {
			start(show)
		}
		
		return show
	}

	const start = (show) => {
		
		// TODO: support canvases of different sizes. just for provided ones? or all?
		if (show.canvas === undefined) {
			document.body.style["margin"] = "0px"
			document.body.style["overflow"] = "hidden"
			document.body.style["background-color"] = Colour.Black

			show.canvas = document.createElement("canvas")
			show.canvas.style["background-color"] = Colour.Black
			show.canvas.style["image-rendering"] = "pixelated"
			document.body.appendChild(show.canvas)
		}

		if (show.context === undefined) {
			show.context = show.canvas.getContext("2d")
		}
		
		const resize = () => {

			show.canvas.width = Math.round(innerWidth * devicePixelRatio)
			show.canvas.height = Math.round(innerHeight * devicePixelRatio)

			window.shrinkScore = 1
			if (show.canvas.width > 1920*2 || show.canvas.height > 1920*2) {
				window.shrinkScore++
				show.canvas.width = Math.round(show.canvas.width / 2)
				show.canvas.height = Math.round(show.canvas.height / 2)
			}

			show.canvas.style["width"] = Math.round(innerWidth)
			show.canvas.style["height"] = Math.round(innerHeight)
			
			show.resize(show.context, show.canvas)
		}

		let t = 0
		const tick = () => {

			t += show.speed
			while (t > 0) {
				if (!show.paused) show.tick(show.context, show.canvas)
				show.supertick(show.context, show.canvas)
				t--
			}
			
			requestAnimationFrame(tick)
		}


		addEventListener("resize", resize)
		addEventListener("keydown", (e) => {
			if (e.key === " ") show.paused = !show.paused
		})
		
		resize()
		requestAnimationFrame(tick)
		
	}

}