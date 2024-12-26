import { CHANGE_PLACE_EVENT_NAME } from "../constants.js";
import { START_KEY } from "../screens/start/start.js";
import { GM3_SPRITES } from "../constants.js";
import Char from "./char.js";
import { toCamelCase, toPxStyle } from "../utils/utils.js";

export default class Place {
	constructor(name, url) {
		this.name = name;
		this.url = url;
		this.start = null;
		this.restart = null;
		this.end = null;
		this.listeners = {};
		this.helpMe = true;
		this.binding = {};
		this.container = document.getElementById("container");
	}

	onStart() {
		console.log("Place: " + this.name + " onStart");
		this.#setupBindings();
		this.#setupExitButton();
		this.#setupChar();
		this.#setupTutorial();

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

	#setupBindings() {
		const elements = this.container.querySelectorAll("[id]");
		for (let e of elements) {
			let key = toCamelCase(e.id);
			this.binding[key] = e;
		}
	}

	#setupExitButton() {
		const exit = this.binding.exit;
		this.listeners.exit = (e) => {
			this.changeScreen(START_KEY);
		};
		if (exit) {
			const img = document.createElement("img");
			img.src = "assets/exit-door.png";
			img.style.scale = 3;
			img.style.transformOrigin = "top";
			img.style.marginBottom = toPxStyle(30);
			img.style.marginRight = toPxStyle(15);
			img.style.marginLeft = toPxStyle(15);
			const text = document.createElement("p");
			text.innerHTML = "EXIT";
			exit.appendChild(img);
			exit.appendChild(text);
			exit.addEventListener("click", this.listeners.exit);
		}
	}

	#setupTutorial() {
		if (this.helpMe && this.tutorialMessage) {
			this.tutorial = document.createElement("div");
			const exitTutorial = document.createElement("p");
			const tutorialContent = document.createElement("div");
			exitTutorial.innerHTML = "X";

			tutorialContent.className = "tutorial";
			this.tutorial.className = "tutorial-box";

			let i = 0;
			const textInterval = setInterval(() => {
				if (i === this.tutorialMessage.length) {
					clearInterval(textInterval);
					return;
				}
				tutorialContent.innerHTML += this.tutorialMessage.charAt(i);
				i++;
			}, 50);

			exitTutorial.addEventListener("click", (e) => {
				this.helpMe = false;
				this.tutorial.style.display = "none";
				clearInterval(textInterval);
			});

			this.container.appendChild(this.tutorial);
			this.tutorial.appendChild(exitTutorial);
			this.tutorial.appendChild(tutorialContent);
		}
	}

	#setupChar() {
		const char_holder = this.binding.char;
		if (char_holder) {
			this.char = new Char(char_holder, GM3_SPRITES);
		}
	}
}
