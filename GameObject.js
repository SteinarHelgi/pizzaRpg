class GameObject {
	constructor(config) {
		this.id = null;

                this.isMounted = false

                this.map = null;
                this.behaviorTimeout = null;

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
                this.map = map;
                map.addWall(this.x, this.y)
                this.behaviorTimeout = setTimeout(() => {
                        this.doBehaviorEvent(map)

                }, 10)
        }


        destroy() {
                this.isMounted = false;
                if (this.map) {
                        this.map.removeWall(this.x, this.y);
                        this.map = null;
                }
                if (this.behaviorTimeout) {
                        clearTimeout(this.behaviorTimeout);
                        this.behaviorTimeout = null;
                }
        }

        async doBehaviorEvent(map) {
                //dont do anything if there is a more important cutscene
                //or I dont have config to do anything or object is unmounted
                if (!this.isMounted || map.isCutscenePlaying || this.behaviorLoop.length === 0) {
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
