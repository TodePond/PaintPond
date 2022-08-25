const Show = {}

{

	Show.make = ({svg, paused = false, scale = 1.0, aspect, speed = 1.0, resize = () => {}, tick = () => {}, supertick = () => {}} = {}) => {
		
		const show = {svg, paused, scale, speed, resize, tick, supertick}

		if (document.body === null) {
			addEventListener("load", () => start(show))
		} else {
			start(show)
		}
		
		return show
	}

	const start = (show) => {
		
		// TODO: support canvases of different sizes. just for provided ones? or all?
		if (show.svg === undefined) {
			document.body.style["margin"] = "0px"
			document.body.style["overflow"] = "hidden"
			document.body.style["background-color"] = Colour.Black

			show.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
			show.svg.style["background-color"] = Colour.Black
			document.body.appendChild(show.svg)
		}
		
		const resize = () => {

			show.svg.width = (innerWidth * 1)
			show.svg.height = (innerHeight * 1)

			window.shrinkScore = 1

			show.svg.style["width"] = (innerWidth)
			show.svg.style["height"] = (innerHeight)

			show.svg.setAttributeNS("http://www.w3.org/2000/svg", 'viewBox', `0 0 ${innerWidth} ${innerHeight}`)
			
			show.resize(show.svg)
		}

		let t = 0
		const tick = () => {

			t += show.speed
			while (t > 0) {
				if (!show.paused) show.tick(show.svg)
				show.supertick(show.svg)
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