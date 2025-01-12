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
				t.reverse();
				return;
			}

			if (nextScreen.url.startsWith("http")) {
				window.location.href = nextScreen.url;
				return;
			} else if (nextScreen === this.currentScreen) {
				this.currentScreen.onRestart();
				t.reverse();
			} else {
				this.currentScreen.onEnd();
				this.#goToScreen(nextScreen).then(() => {
					t.reverse();
				});
			}
		});
	}

	#goToScreen(nextScreen) {
		return new Promise((res, rej) => {
			addToTarget(this.container, nextScreen.url)
				.then(
					() => {
						nextScreen.onStart();
						this.currentScreen = nextScreen;
						res();
					},
					() => {
						this.currentScreen.onRestart();
						res();
					}
				)
				.catch((e) => {
					console.error(e);
					rej();
				});
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
		return new Promise((res, rej) => {
			const t = transition.animate(frames, duration);
			t.onfinish = (e) => {
				res(t);
			};
		});
	}
}
