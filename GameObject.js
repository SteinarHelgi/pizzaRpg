class GameObject {
	constructor(config) {
		this.id = null;

		this.isMounted = false
		this.x = config.x || 0
		this.y = config.y || 0
		this.direction = config.direction || "down";
		this.behaviorLoop = config.behaviorLoop || []
		this.behaviorLoopIndex = 0
		this.talking = config.talking

		this.sprite = new Sprite({
			gameObject: this,
			src: config.src || "/images/characters/people/hero.png"
		})

	}
	update() {

	}
	mount(map) {
		this.isMounted = true
		map.addWall(this.x, this.y)

		setTimeout(() => {
			this.doBehaviorEvent(map)

		}, 10)
	}

	async doBehaviorEvent(map) {
		//dont do anything if there is a more important cutscene 
		//or I dont have config to do anyting
		if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
			return
		}

		//Setting up our event with relevant info
		let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
		eventConfig.who = this.id;
		//Create an event instance out of our next event config
		const eventHandler = new OverworldEvent({ map, event: eventConfig });
		await eventHandler.init();

		//Setting the next event to fire
		this.behaviorLoopIndex += 1;
		if (this.behaviorLoopIndex === this.behaviorLoop.length) {
			this.behaviorLoopIndex = 0;
		}

		this.doBehaviorEvent(map)
	}
}
