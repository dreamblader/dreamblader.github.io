import Char from "../../base/char.js";
import { GM3_SPRITES } from "../../constants.js";
import Place from "../../base/screen.js";

const START = new Place("start", "src/screens/start/start.html");
START.start = onStart;
START.restart = onRestart;

function onStart() {
	this.char = new Char(document.getElementById("char"), GM3_SPRITES);
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
