import Char from "../../base/char.js";
import { GM3_SPRITES } from "../../constants.js";
import Place from "../../base/screen.js";

const START = new Place("src/screens/start/start.html");
START.start = onStart;

function onStart() {
	console.log(this);
	this.char = new Char(document.getElementById("char"), GM3_SPRITES);
	setupBuildings.call(this);
	window.addEventListener("click", (event) => {
		windowClickEvent.call(this, event);
	});
}

function setupBuildings() {
	this.buildings = document.getElementsByClassName("building");

	Array.from(this.buildings).forEach((element) => {
		element.addEventListener("click", (event) => {
			windowClickEvent.call(this, event);
			buildingClickEvent.call(this);
		});
	});
}

function buildingClickEvent() {
	this.char.block = true;
	this.char.movement.onfinish = (e) => {
		const t = startTransition(transition, container);
		t.onfinish = (e) => {
			addToTarget(container, getPlace(element.id)).then(
				() => {
					t.reverse();
					t.onfinish = null;
				},
				(err) => {
					console.log(err);
					location.reload();
				}
			);
		};
	};
}

function windowClickEvent(event) {
	console.log(this);
	this.char.clickIn(event.x, event.y);
}

export default START;
