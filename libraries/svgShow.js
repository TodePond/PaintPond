const Show = {}

{

	Show.make = ({layers, container, paused = false, scale = 1.0, aspect, speed = 1.0, resize = () => {}, tick = () => {}, supertick = () => {}, layerCount = 1} = {}) => {
		if (layers !== undefined) {
			layerCount = layers.length;
		}
		const show = {layers, layerCount, paused, scale, speed, resize, tick, supertick}

		if (document.body === null) {
			addEventListener("load", () => start(show))
		} else {
			start(show)
		}
		
		return show
	}

	const start = (show) => {
		

		if (show.layers === undefined) {
			if (show.container === undefined) {
				show.container = document.body
			}
			document.body.style["margin"] = "0px"
			document.body.style["overflow"] = "hidden"
			document.body.style["background-color"] = Colour.Black

			show.layers = new Array(show.layerCount)
			for (let i = 0; i < show.layerCount; i++) {
				show.layers[i] = document.createElementNS("http://www.w3.org/2000/svg", "svg")
				show.layers[i].style["position"] = "absolute"
				document.body.appendChild(show.layers[i])
			}
			show.layers[0].style["background-color"] = Colour.Black
		}
		
		show.layers.first = show.layers[0]
		show.layers.last = show.layers[show.layers.length - 1]

		const resize = () => {
			show.layers.forEach((layer) => {
				layer.width = (innerWidth * 1)
				layer.height = (innerHeight * 1)

				window.shrinkScore = 1

				layer.style["width"] = (innerWidth)
				layer.style["height"] = (innerHeight)

				layer.setAttributeNS("http://www.w3.org/2000/svg", 'viewBox', `0 0 ${innerWidth} ${innerHeight}`)
			})
			show.resize(show.layers)
		}

		let t = 0
		const tick = () => {

			t += show.speed
			while (t > 0) {
				if (!show.paused) show.tick(show.layers)
				show.supertick(show.layers)
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