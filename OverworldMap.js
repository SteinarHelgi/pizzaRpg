class OverworldMap {
	constructor(config) {
		this.gameObjects = config.gameObjects;
		this.lowerImage = new Image();
		this.lowerImage.src = config.lowerSrc;
		this.upperImage = new Image()
		this.upperImage.src = config.upperSrc;
	}
	drawLowerImage(ctx) {
		ctx.drawImage(this.lowerImage, 0, 0)

	}
	drawUpperImage(ctx) {
		ctx.drawImage(this.upperImage, 0, 0)
	}

}
window.OverworldMaps = {
	DemoRoom: {
		lowerSrc: "/images/maps/DemoLower.png",
		upperSrc: "/images/maps/DemoUpper.png",
		gameObjects: {
			hero: new Person({
				x: utils.withGrid(5),
				y: utils.withGrid(7)
			}),
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
