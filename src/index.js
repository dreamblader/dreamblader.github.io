import { SCREENS, CHANGE_PLACE_EVENT_NAME } from "./constants.js";
import ScreenManager from "./base/screen-manager.js";

const manager = new ScreenManager(SCREENS);

document.addEventListener(CHANGE_PLACE_EVENT_NAME, (e) => {
	manager.changeScreen(e.detail.screenId);
});
