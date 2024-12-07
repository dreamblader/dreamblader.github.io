import { toPxStyle } from "./utils/utils.js";
import { SCREENS } from "./constants.js";
import ScreenManager from "./base/screen-manager.js";

//REFACTOR EVERYTHING TO MANAGER

const manager = new ScreenManager(SCREENS);
// window.onload = () => {

// };

// window.addEventListener("DOMContentLoaded", () => {
// 	if (manager.currentScreen) {
// 		manager.currentScreen.onStart();
// 	}
// });

function paintAt(posX, posY) {
	const t = document.createElement("div");
	t.style.background = "red";
	t.style.width = "4px";
	t.style.height = "4px";
	t.style.position = "absolute";
	t.style.top = toPxStyle(posY);
	t.style.left = toPxStyle(posX);
	container.append(t);
}

//FIXME need to find a way to catch new elements when they get loaded
// document.getElementById("exit").addEventListener("click", (event) => {
// 	startTransition(transition, container, "start");
// });
