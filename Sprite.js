class Sprite {
	constructor(config) {

		//Set up images
		this.image = new Image()
		this.image.src = config.src
		this.image.onload = () => {
			this.isLoaded = true
		}
		//Set up Shadow
		this.shadow = new Image()
		this.useShadow = true;
		if (this.useShadow) {
			this.shadow.src = "images/characters/shadow.png"
		}
		this.shadow.onload = () => {
			this.isShadowLoaded = true
		}

		//Configure animations and initial state
		this.animations = config.animations || {
			idleDown: [
				[0, 0]
			],
		}
		this.currentAnimation = config.animation || "idleDown"
		this.currentAnimationFrame = 0
		this.gameObject = config.gameObject

	}
	draw(ctx) {
		const x = this.gameObject.x - 8;
		const y = this.gameObject.y - 18;

		this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

		this.isLoaded && ctx.drawImage(
			this.image,
			0, //left cut
			0, //right cut
			32,
			32,
			x,
			y,
			32,
			32,

		);
	}
}
