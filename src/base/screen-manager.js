import { addToTarget } from "../utils/screen-utils.js";

export default class ScreenManager {
	constructor(screens) {
		this.screens = screens;
		this.container = document.getElementById("container");
		this.transition = document.getElementById("transition");
		this.#goToScreen(screens[Object.keys(screens)[0]]);
	}

	changeScreen(screenId) {
		const nextScreen = this.screens[screenId];

		this.#startFadeTransition().then((t) => {
			if (!nextScreen) {
				return;
			}

			if (nextScreen.url.startsWith("http")) {
				window.location.href = nextScreen.url;
				return;
			} else if (nextScreen === this.currentScreen) {
				this.currentScreen.onRestart();
			} else {
				this.currentScreen.onEnd();
				this.#goToScreen(nextScreen);
			}

			t.reverse();
			t.onfinish = () => {
				transition.style.visibility = "hidden";
			};
		});
	}

	#goToScreen(nextScreen) {
		addToTarget(this.container, nextScreen.url)
			.then(
				() => {
					nextScreen.onStart();
					this.currentScreen = nextScreen;
				},
				() => {
					this.currentScreen.onRestart();
				}
			)
			.catch((e) => {
				console.error(e);
			});
	}

	#startFadeTransition() {
		const frames = [
			{ backgroundColor: "transparent" },
			{ backgroundColor: "black" },
		];
		const duration = {
			duration: 1000,
			fill: "forwards",
		};
		transition.style.visibility = "visible";
		return new Promise((res, rej) => {
			const t = transition.animate(frames, duration);
			t.onfinish = (e) => {
				res(t);
			};
		});
	}
}
