import { CHANGE_PLACE_EVENT_NAME } from "../constants.js";

export default class Place {
	constructor(name, url) {
		this.name = name;
		this.url = url;
		this.start = null;
		this.restart = null;
		this.end = null;
	}

	onStart() {
		console.log("Place: " + this.name + " onStart");
		this.#setupExitButton();

		if (typeof this.start === "function") {
			this.start();
		}
	}

	onRestart() {
		console.log("Place: " + this.name + " onRestart");
		if (typeof this.restart === "function") {
			this.restart();
		}
	}

	onEnd() {
		console.log("Place: " + this.name + " onEnd");
		if (typeof this.end === "function") {
			this.end();
		}
	}

	changeScreen(placeId) {
		const event = new CustomEvent(CHANGE_PLACE_EVENT_NAME, {
			detail: { screenId: placeId },
		});
		document.dispatchEvent(event);
	}

	#setupExitButton() {
		this.exit = document.getElementById("exit");
		if (this.exit) {
			exit.addEventListener("click", this.#exit);
		}
	}

	#exit() {
		console.log("EXIT");
	}

	#killExitButton() {
		if (this.exit) {
			this.exit.removeEventListener("click", this.#exit);
		}
	}
}
