class GameObject {
	constructor(config) {
		this.id = null;

                this.isMounted = false
                // Used to store any scheduled behavior event so it can be cancelled
                this.behaviorTimeout = null
		this.x = config.x || 0
		this.y = config.y || 0
		this.direction = config.direction || "down";
		this.behaviorLoop = config.behaviorLoop || []
		this.behaviorLoopIndex = 0
		this.talking = config.talking || [];

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

                // Kick off the first behavior event after a short delay
                this.behaviorTimeout = setTimeout(() => {
                        this.doBehaviorEvent(map)

                }, 10)
        }

        async doBehaviorEvent(map) {
                // Exit early if this object has been destroyed
                if (!this.isMounted) {
                        return
                }

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

                // Schedule the next behavior event to allow for cleanup
                this.behaviorTimeout = setTimeout(() => {
                        this.doBehaviorEvent(map)
                }, 0)
        }

        destroy() {
                this.isMounted = false
                clearTimeout(this.behaviorTimeout)
                this.behaviorTimeout = null
        }
}
