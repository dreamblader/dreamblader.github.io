import { isExternalLink } from "../utils.js";

export default class ScreenManager {
	constructor(screens) {
		this.screens = screens;
		this.container = document.getElementById("container");
		this.transition = document.getElementById("transition");
		window.onresize = () => this.resizeScreen();
		this.#setupStyles();
		this.#redirectToScreen(new URLSearchParams(window.location.search));
	}

	#setupStyles() {
		for (screen of Object.values(this.screens)) {
			if (isExternalLink(screen.url)) {
				continue;
			}

			let urlSegments = screen.url.split("/");
			urlSegments[urlSegments.length - 1] = "style.css";
			let styleFile = urlSegments.join("/");
			this.#getContent(styleFile).then(
				() => {
					let link = document.createElement("link");
					link.setAttribute("rel", "stylesheet");
					link.setAttribute("href", styleFile);
					document.head.appendChild(link);
				},
				() => {}
			);
		}
	}

	changeScreen(screenId) {
		const nextScreen = this.screens[screenId];

		this.#startFadeTransition().then((t) => {
			if (!nextScreen) {
				t.reverse();
				return;
			}

			if (isExternalLink(nextScreen.url)) {
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

	resizeScreen() {
		const viewport = {
			height: window.innerHeight,
			width: window.innerWidth,
		};
		this.currentScreen.onResize(viewport);
	}

	#redirectToScreen(urlParams) {
		const defaultFirstScreen = this.screens[Object.keys(this.screens)[0]];
		if (urlParams.size === 0) {
			this.#goToScreen(defaultFirstScreen);
		} else {
			const url = new URL(location);
			url.search = "";
			window.history.pushState({}, "", url);
			for (let id in this.screens) {
				if (urlParams.has(id)) {
					this.#goToScreen(this.screens[id], urlParams.get(id));
					return;
				}
			}
			this.#goToScreen(defaultFirstScreen);
		}
	}

	#goToScreen(nextScreen, startParams) {
		return new Promise((res, rej) => {
			this.addToTarget(this.container, nextScreen.url)
				.then(
					() => {
						nextScreen.onStart(startParams);
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

	addToTarget(root_target, file) {
		return this.#getContent(file)
			.then((res) => {
				root_target.innerHTML = res;
			})
			.catch((err) => {
				console.error(err);
				rej(err);
			});
	}

	#getContent(file) {
		return new Promise((res, rej) => {
			const xReq = new XMLHttpRequest();
			xReq.onload = () => {
				if (xReq.status == 200) {
					res(xReq.responseText);
				} else {
					rej(xReq.responseText);
				}
			};
			xReq.open("GET", file);
			xReq.send();
		});
	}
}
