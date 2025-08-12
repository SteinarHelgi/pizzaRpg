class DirectionInput {
	constructor() {
		this.heldDirections = [];

		this.map = {
			"ArrowUp": "up",
			"ArrowDown": "down",
			"ArrowLeft": "left",
			"ArrowRight": "right",
			"w": "up",
			"s": "down",
			"a": "left",
			"d": "right",
		}

	}

	get direction() {
		return this.heldDirections[0]
	}
	init() {
		document.addEventListener("keydown", e => {
			const dir = this.map[e.key]
			if (dir && this.heldDirections.indexOf(dir) == -1) {
				this.heldDirections.unshift(dir)
			}
		})
		document.addEventListener("keyup", e => {
			const dir = this.map[e.key]
			const index = this.heldDirections.indexOf(dir)
			if (index > -1) {
				this.heldDirections.splice(index, 1)
			}
		})
	}
	destroy() {
		document.removeEventListener("keydown", this.onKeyDown);
		document.removeEventListener("keyup", this.onKeyUp);
	}
}
