class Overworld {
	constructor(config) {
		this.element = config.element
		this.canvas = document.querySelector(".game-canvas")
		this.ctx = this.canvas.getContext("2d")
		this.map = null;

	}
	startGameLoop() {
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

			//Loop again
			requestAnimationFrame(() => {
				step()
			})
		}
		step()
	}

	bindActionInput() {
		new KeyPressListener("Enter", () => {
			//Is there a person here to talk to?
			this.map.checkForActionCutscene()

		})
	}


	init() {
		this.map = new OverworldMap(
			window.OverworldMaps.DemoRoom
		);
		this.map.mountObjects()
		this.directionInput = new DirectionInput()
		this.directionInput.init()
		this.startGameLoop()
		this.bindActionInput()
		/* this.map.startCutscene([
			{ who: "hero", type: "walk", direction: "right" },
			{ who: "hero", type: "walk", direction: "right" },
			{ who: "hero", type: "walk", direction: "right" },
			{ who: "npc1", type: "walk", direction: "down" },
			{ who: "npc1", type: "walk", direction: "left" },
			{ who: "npc1", type: "walk", direction: "left" },
			{ who: "npc1", type: "stand", direction: "down", time: 400 },
			{ who: "hero", type: "stand", direction: "up", time: 400 },
			{ type: "textMessage", text: "Thank you for coming" },
			{ type: "textMessage", text: "Its my pleasure" },
		])
*/
	}
}
