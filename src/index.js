import { toPxStyle } from "./utils/utils.js";
import { SCREENS, CHANGE_PLACE_EVENT_NAME } from "./constants.js";
import ScreenManager from "./base/screen-manager.js";

//REFACTOR EVERYTHING TO MANAGER

const manager = new ScreenManager(SCREENS);
document.addEventListener(CHANGE_PLACE_EVENT_NAME, (e) => {
	manager.changeScreen(e.detail.screenId);
});

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
