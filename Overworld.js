class Overworld {
	constructor(config) {
		this.element = config.element
		this.canvas = document.querySelector(".game-canvas")
		this.ctx = this.canvas.getContext("2d")
		this.map = null;

	}
	startGameLoop(now) {

		let lastTime = performance.now();
		let lastFpsUpdate = lastTime;
		let frameCount = 0;
		let fps = 0;

		const step = () => {


			//Clear draw
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)


			//Establish camera person 
			const cameraPerson = this.map.gameObjects.hero
			//Update all objects
			Object.values(this.map.gameObjects).forEach((object) => {
				object.update({
					arrow: this.directionInput.direction,
					map: this.map,
				})
			})

			//Draw bottom layer
			this.map.drawLowerImage(this.ctx, cameraPerson)
			//Draw all game objects

			Object.values(this.map.gameObjects).sort((a, b) => {
				return a.y - b.y
			}).forEach((object) => {
				object.sprite.draw(this.ctx, cameraPerson)

			})
			//Draw upper layer
			this.map.drawUpperImage(this.ctx, cameraPerson)

			frameCount++;
			let elapsedSinceLastFps = now - lastFpsUpdate;
			console.log(elapsedSinceLastFps)
			if (elapsedSinceLastFps >= 1000) {  // update every second
				fps = (frameCount * 1000) / elapsedSinceLastFps;
				lastFpsUpdate = now;
				frameCount = 0;
				// print to console
				console.log(`FPS: ${fps.toFixed(1)}`);
			}
			requestAnimationFrame(() => {
				step()
			})
		}
		step()
	}
	init() {
		this.map = new OverworldMap(
			window.OverworldMaps.DemoRoom
		);
		this.map.mountObjects()
		this.directionInput = new DirectionInput()
		this.directionInput.init()
		this.startGameLoop()
	}
}
