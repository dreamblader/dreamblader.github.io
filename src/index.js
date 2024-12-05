import { toPxStyle } from "./utils.js";
import Char from "./base/char.js";
import { GM3_SPRITES } from "./constants.js";
import {
	startTransition,
	addToTarget,
	getPlace,
} from "./base/screen_transition.js";

const char = new Char(document.getElementById("char"), GM3_SPRITES);
const transition = document.getElementById("transition");
const container = document.getElementById("container");
const buildings = document.getElementsByClassName("building");

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

function clickEvent(event) {
	char.clickIn(event.x, event.y);
}

window.addEventListener("click", (event) => {
	clickEvent(event);
	//paintAt(event.x, event.y)
});

Array.from(buildings).forEach((element) => {
	element.addEventListener("click", (event) => {
		clickEvent(event);
		char.block = true;
		char.movement.onfinish = (e) => {
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
	});
});

//FIXME need to find a way to catch new elements when they get loaded
// document.getElementById("exit").addEventListener("click", (event) => {
// 	startTransition(transition, container, "start");
// });
