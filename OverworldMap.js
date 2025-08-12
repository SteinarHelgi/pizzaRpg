class OverworldMap {
        constructor(config) {
                this.overworld = null;
                this.walls = config.walls || {};
                this.gameObjects = {};

                Object.keys(config.gameObjects).forEach(key => {
                        let objectConfig = config.gameObjects[key];
                        let object;
                        // In the future, different object types could be initialized here
                        object = new Person(objectConfig);
                        object.id = key;
                        this.gameObjects[key] = object;
                });

		this.lowerImage = new Image();
		this.lowerImage.src = config.lowerSrc;

		this.upperImage = new Image()
		this.upperImage.src = config.upperSrc;

		this.isCutscenePlaying = false;

		this.cutsceneSpaces = config.cutsceneSpaces || {};
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
		const map = this
		console.log(map)
		const match = Object.values(this.gameObjects).find(object => {
			return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
		})
		if (!this.isCutscenePlaying && match && match.talking.length) {
			this.startCutscene(match.talking[0].events)

		}
	}

	checkForFootstepCutscene() {
		const hero = this.gameObjects["hero"]
		const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]
		if (!this.isCutscenePlaying && match) {
			this.startCutscene(match[0].events)
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
                        hero: {
                                type: "Person",
                                isPlayerControlled: true,
                                x: utils.withGrid(2),
                                y: utils.withGrid(6),
                        },
                        npc1: {
                                type: "Person",
                                x: utils.withGrid(8),
                                y: utils.withGrid(5),
                                src: "/images/characters/people/npc1.png",
                                talking: [
                                        {
                                                events: [
                                                        { type: "textMessage", text: "hi there!", faceHero: "npc1" },
                                                        { type: "textMessage", text: "how are ya'" },

                                                ]
                                        }
                                ]
                        },
                        npc2: {
                                type: "Person",
                                x: utils.withGrid(6),
                                y: utils.withGrid(9),
                                src: "/images/characters/people/npc2.png",
                                behaviorLoop: [
                                        { type: "stand", direction: "left", time: 800 },
                                ]
                        },
                },
		cutsceneSpaces: {
			[utils.asGridCoord(7, 4)]: [
				{
					events: [
						{ who: "npc1", type: "walk", direction: "left" },
						{ type: "textMessage", text: "Hey you cant be in there!" },
						{ who: "npc1", type: "walk", direction: "right" },
						{ who: "hero", type: "walk", direction: "down" },
						{ who: "hero", type: "walk", direction: "left" },
					]
				}
			],
			[utils.asGridCoord(5, 10)]: [
				{
					events: [
						{ type: "changeMap", map: "Kitchen" },
					]
				}
			]
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
                        hero: {
                                type: "Person",
                                isPlayerControlled: true,
                                x: utils.withGrid(3),
                                y: utils.withGrid(5),
                        },
                        npc3: {
                                type: "Person",
                                x: utils.withGrid(10),
                                y: utils.withGrid(8),
                                src: "images/characters/people/npc3.png",
                                behaviorLoop: [
                                        { type: "stand", direction: "left" },
                                ],
                                talking: [
                                        {
                                                events: [
                                                        { type: "textMessage", text: "you made it!" },
                                                ],
                                        }
                                ],
                        }
                },
		cutsceneSpaces: {
			[utils.asGridCoord(5, 10)]: [
				{
					events: [
						{ type: "changeMap", map: "DemoRoom" },
					]
				}
			]
		},


	}
}
