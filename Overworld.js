class Overworld {
	constructor(config) {
		this.element = config.element
		this.canvas = document.querySelector(".game-canvas")
		this.ctx = this.canvas.getContext("2d")
		this.map = null;

	}
	startGameLoop() {
		if (this.rafId) cancelAnimationFrame(this.rafId);
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
			this.rafId = requestAnimationFrame(step)
		}
		this.rafId = requestAnimationFrame(step)
	}

	stopGameLoop() {
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}

	bindActionInput() {
		new KeyPressListener("Enter", () => {
			//Is there a person here to talk to?
			this.map.checkForActionCutscene()

		})
	}

	unbindHeroPosition() {
		if (this.onHeroWalkComplete) {
			document.removeEventListener("PersonWalkingComplete", this.onHeroWalkComplete);
			this.onHeroWalkComplete = null;
		}
	}
	bindHeroPosition() {
		this.onHeroWalkComplete = (e) => {
			if (e.detail.whoId === "hero") this.map.checkForFootstepCutscene();
		};
		document.addEventListener("PersonWalkingComplete", this.onHeroWalkComplete);
	}
        startMap(mapConfig) {
                //Stop game loop and unbind everything
                this.stopGameLoop?.()
                this.unbindHeroPosition?.();
                this.directionInput?.destroy?.();

                //Unmount old map objects
                this.map?.unmountObjects?.();

                //Change the map
                this.map = new OverworldMap(mapConfig);
		this.map.overworld = this;
		this.map.mountObjects();

		//Rebind and restart gameloop and bindings
		this.bindHeroPosition();
		this.directionInput?.init?.(); // if you want input active immediately
		this.startGameLoop();
	}


	init() {
		this.startMap(window.OverworldMaps.Kitchen)


		this.bindHeroPosition()
		this.bindActionInput()

		this.directionInput = new DirectionInput()
		this.directionInput.init()

		this.startGameLoop()
	}
}
