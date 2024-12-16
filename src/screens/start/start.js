import Place from "../../base/screen.js";
import { toPxStyle } from "../../utils/utils.js";

export const START_KEY = "start";
const START_PATH = "src/screens/start/start.html";
const START = new Place(START_KEY, START_PATH);
START.tutorialMessage = `Hello and welcome to my 
Personal Web GitHub Page.
Feel free to click around to make me move and select a building to move to any section of this site`;
START.start = onStart;
START.restart = onRestart;
START.end = onEnd;

function onStart() {
	setupBuildings.call(this);
	this.container.style.backgroundImage = "url(assets/grass.png)";
	this.container.style.backgroundSize = toPxStyle(64);
	this.listeners.anyClick = (event) => {
		windowClickEvent.call(this, event);
	};
	window.addEventListener("click", this.listeners.anyClick);
}

function onRestart() {
	this.char.reset();
}

function onEnd() {
	this.container.style.backgroundImage = "";
	this.container.style.backgroundSize = "";
	window.removeEventListener("click", this.listeners.anyClick);
}

function setupBuildings() {
	this.buildings = document.getElementsByClassName("building");

	Array.from(this.buildings).forEach((element) => {
		element.addEventListener("click", (event) => {
			windowClickEvent.call(this, event);
			buildingClickEvent.call(this, element);
		});
	});
}

function buildingClickEvent(element) {
	this.char.block = true;
	this.char.movement.onfinish = (e) => {
		this.changeScreen(element.id);
	};
}

function windowClickEvent(event) {
	this.char.clickIn(event.x, event.y);
}

export default START;
