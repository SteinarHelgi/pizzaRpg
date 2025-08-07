class Overworld {
	constructor(config) {
		this.element = config.element
		this.canvas = document.querySelector(".game-canvas")
		this.ctx = this.canvas.getContext("2d")
		this.map = null;

	}
	startGameLoop() {
		const step = () => {
			requestAnimationFrame(() => {

				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
				//Draw bottom layer
				this.map.drawLowerImage(this.ctx)
				//Draw all game objects

				Object.values(this.map.gameObjects).forEach((object) => {
					object.update({
						arrow: this.directionInput.direction


					})
					object.sprite.draw(this.ctx)

				})
				//Draw upper layer
				this.map.drawUpperImage(this.ctx)
				step()
			})
		}
		step()
	}
	init() {
		this.map = new OverworldMap(
			window.OverworldMaps.DemoRoom
		);
		this.directionInput = new DirectionInput()
		this.directionInput.init()
		this.startGameLoop()
	}
}
