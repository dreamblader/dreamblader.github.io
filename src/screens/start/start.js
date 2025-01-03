import Place from "../../base/screen.js";
import { toPxStyle } from "../../utils/utils.js";

export const START_KEY = "start";
const START_PATH = "src/screens/start/start.html";
const TUTORIAL = `Hello and welcome to my 
Personal Web GitHub Page.
Feel free to click around to make me move and select a building to move to any section of this site`;

const START = new Place(START_KEY, START_PATH);
START.tutorialMessage = TUTORIAL;
START.start = onStart;
START.restart = onRestart;
START.end = onEnd;

//I do not know if this is better than conciously use call in every Place inside function
const setupBuildings = _setupBuildings.bind(START);
const buildingClickEvent = _buildingClickEvent.bind(START);
const windowClickEvent = _windowClickEvent.bind(START);

function onStart() {
	setupBuildings(document.getElementsByTagName("building"));
	this.container.style.backgroundImage = "url(assets/grass.png)";
	this.container.style.backgroundSize = toPxStyle(64);
	this.listeners.anyClick = (event) => {
		windowClickEvent(event);
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

function _setupBuildings(buildings) {
	Array.from(buildings).forEach((element) => {
		element.addEventListener("click", (event) => {
			windowClickEvent(event);
			buildingClickEvent(element);
		});
	});
}

function _buildingClickEvent(element) {
	this.char.block = true;
	this.char.movement.onfinish = (e) => {
		this.changeScreen(element.id);
	};
}

function _windowClickEvent(event) {
	this.char.clickIn(event.x, event.y);
}

export default START;
