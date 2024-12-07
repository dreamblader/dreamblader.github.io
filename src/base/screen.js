export default class Place {
	constructor(url) {
		this.url = url;
		this.start = null;
		this.restart = null;
		this.end = null;
	}

	onStart() {
		console.log("Place: " + this.url + " onStart");
		this.#setupExitButton();

		if (typeof this.start === "function") {
			this.start();
		}
	}

	onRestart() {
		console.log("Place: " + this.url + " onRestart");
		if (typeof this.restart === "function") {
			this.restart();
		}
	}

	onEnd() {
		console.log("Place: " + this.url + " onEnd");
		if (typeof this.end === "function") {
			this.end();
		}
	}

	#setupExitButton() {
		this.exit = document.getElementById("exit");
		if (this.exit) {
			exit.addEventListener("click", this.#exit);
		}
	}

	#exit() {}

	#killExitButton() {
		if (this.exit) {
			this.exit.removeEventListener("click", this.#exit);
		}
	}
}
