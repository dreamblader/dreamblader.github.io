import { CHANGE_PLACE_EVENT_NAME } from "../constants.js";
import { START_KEY } from "../screens/start/start.js";
import { GM3_SPRITES } from "../constants.js";
import Char from "./char.js";
import { toPxStyle } from "../utils/utils.js";

export default class Place {
	constructor(name, url) {
		this.name = name;
		this.url = url;
		this.start = null;
		this.restart = null;
		this.end = null;
		this.listeners = {};
		this.container = document.getElementById("container");
	}

	onStart() {
		console.log("Place: " + this.name + " onStart");
		this.#setupExitButton();
		this.#setupChar();

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

		if (this.char) {
			this.char.free();
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
		this.listeners.exit = (e) => {
			this.changeScreen(START_KEY);
		};
		if (this.exit) {
			const img = document.createElement("img");
			img.src = "assets/exit-door.png";
			img.style.scale = 3;
			img.style.transformOrigin = "top";
			img.style.marginBottom = toPxStyle(30);
			img.style.marginRight = toPxStyle(15);
			img.style.marginLeft = toPxStyle(15);
			const text = document.createElement("p");
			text.innerHTML = "EXIT";
			this.exit.appendChild(img);
			this.exit.appendChild(text);
			exit.addEventListener("click", this.listeners.exit);
		}
	}

	#setupChar() {
		const char_holder = document.getElementById("char");
		if (char_holder) {
			this.char = new Char(char_holder, GM3_SPRITES);
		}
	}

	//TODO create event listener removal from listener object
}
