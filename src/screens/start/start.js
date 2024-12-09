import Place from "../../base/screen.js";

export const START_KEY = "start";
const START_PATH = "src/screens/start/start.html";
const START = new Place(START_KEY, START_PATH);
START.start = onStart;
START.restart = onRestart;

function onStart() {
	setupBuildings.call(this);
	window.addEventListener("click", (event) => {
		windowClickEvent.call(this, event);
	});
}

function onRestart() {
	this.char.reset();
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
