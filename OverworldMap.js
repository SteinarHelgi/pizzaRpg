class OverworldMap {
	constructor(config) {
		this.gameObjects = config.gameObjects;
		this.walls = config.walls

		this.lowerImage = new Image();
		this.lowerImage.src = config.lowerSrc;

		this.upperImage = new Image()
		this.upperImage.src = config.upperSrc;

		this.isCutscenePlaying = false
	}
	drawLowerImage(ctx, cameraPerson) {
		ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)

	}
	drawUpperImage(ctx, cameraPerson) {
		ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
	}

	isSpaceTaken(currentX, currentY, direction) {
		const { x, y } = utils.nextPosition(currentX, currentY, direction)
		return this.walls[`${x},${y}`] || false
	}
	mountObjects() {
		Object.keys(this.gameObjects).forEach((key) => {
			let object = this.gameObjects[key]
			object.id = key
			//TODO: determine if objects should be mounted
			object.mount(this)
		})
	}

	async startCutscene(events) {
		this.isCutscenePlaying = true;


		//Start a loop of async events
		//Await each one 

		for (let i = 0; i < events.length; i++) {
			const eventHandler = new OverworldEvent({
				map: this,
				event: events[i]
			})
			await eventHandler.init()
		}
		this.isCutscenePlaying = false
		//Reset Npcs to do their auto thing
		Object.values(this.gameObjects).forEach(object => { object.doBehaviorEvent(this) })

	}

	checkForActionCutscene() {
		const hero = this.gameObjects["hero"]
		const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction)
		const match = Object.values(this.gameObjects).find(object => {
			return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
		})
		if (!this.isCutscenePlaying && match && match.talking.length) {
			this.startCutscene(match.talking[0].events)

		}


	}
	addWall(x, y) {
		this.walls[`${x},${y}`] = true
	}
	removeWall(x, y) {
		delete this.walls[`${x},${y}`]
	}
	moveWall(wasX, wasY, direction) {
		this.removeWall(wasX, wasY)
		const { x, y } = utils.nextPosition(wasX, wasY, direction)
		this.addWall(x, y)
	}
}
window.OverworldMaps = {
	DemoRoom: {
		lowerSrc: "/images/maps/DemoLower.png",
		upperSrc: "/images/maps/DemoUpper.png",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.withGrid(2),
				y: utils.withGrid(6),
			}),
			npc1: new Person({
				x: utils.withGrid(7),
				y: utils.withGrid(5),
				src: "/images/characters/people/npc1.png",
				behaviorLoop: [
					{ type: "stand", direction: "right", time: 800 },
				],
				talking: [
					{
						events: [
							{ type: "textMessage", text: "hi there!", faceHero: "npc1" },
							{ type: "textMessage", text: "how are ya'" },

						]
					}
				]
			}),
			npc2: new Person({
				x: utils.withGrid(6),
				y: utils.withGrid(9),
				src: "/images/characters/people/npc2.png",
				behaviorLoop: [
					{ type: "walk", direction: "left" },
					{ type: "stand", direction: "left", time: 800 },
					{ type: "walk", direction: "up" },
					{ type: "walk", direction: "right" },
					{ type: "walk", direction: "down" },
				]

			}),

		},
		walls: {
			//"16,16":true
			[utils.asGridCoord(7, 6)]: true,
			[utils.asGridCoord(8, 6)]: true,
			[utils.asGridCoord(7, 7)]: true,
			[utils.asGridCoord(8, 7)]: true,
			[utils.asGridCoord(1, 3)]: true,
			[utils.asGridCoord(2, 3)]: true,
			[utils.asGridCoord(3, 3)]: true,
			[utils.asGridCoord(4, 3)]: true,
			[utils.asGridCoord(5, 3)]: true,
			[utils.asGridCoord(6, 4)]: true,
			[utils.asGridCoord(6, 3)]: true,
			[utils.asGridCoord(6, 2)]: true,
			[utils.asGridCoord(6, 1)]: true,
			[utils.asGridCoord(8, 4)]: true,
			[utils.asGridCoord(8, 3)]: true,
			[utils.asGridCoord(8, 2)]: true,
			[utils.asGridCoord(8, 1)]: true,
			[utils.asGridCoord(9, 3)]: true,
			[utils.asGridCoord(10, 3)]: true,
		}
	},
	Kitchen: {
		lowerSrc: "/images/maps/KitchenLower.png",
		upperSrc: "/images/maps/KitchenUpper.png",
		gameObjects: {
			hero: new Person({
				x: 3,
				y: 5
			}),
			npc1: new Person({
				x: 9,
				y: 6,
				src: "images/characters/people/npc1.png"
			}),
			npc2: new Person({
				x: 10,
				y: 8,
				src: "images/characters/people/npc2.png"
			})
		}
	}
}
