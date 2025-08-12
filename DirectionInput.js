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
                this.onKeyDown = (e) => {
                        const dir = this.map[e.key]
                        if (dir && this.heldDirections.indexOf(dir) == -1) {
                                this.heldDirections.unshift(dir)
                        }
                }
                this.onKeyUp = (e) => {
                        const dir = this.map[e.key]
                        const index = this.heldDirections.indexOf(dir)
                        if (index > -1) {
                                this.heldDirections.splice(index, 1)
                        }
                }

                document.addEventListener("keydown", this.onKeyDown)
                document.addEventListener("keyup", this.onKeyUp)
        }
        destroy() {
                document.removeEventListener("keydown", this.onKeyDown);
                document.removeEventListener("keyup", this.onKeyUp);
        }
}
