import Place from "../../base/screen.js";
import { toPxStyle } from "../../utils.js";

export const START_KEY = "start";
const START_PATH = "src/screens/start/start.html";
const START_TUTORIAL = `Hello and welcome to my 
Personal Web GitHub Page.
Feel free to click around to make me move and select a building to move to any section of this site`;

const START = new Place(START_KEY, START_PATH);
START.tutorialMessage = START_TUTORIAL;

const calls = {
	start: function () {
		this.setupBuildings(document.getElementsByTagName("building"));
		this.container.style.backgroundImage = "url(assets/grass.png)";
		this.container.style.backgroundSize = toPxStyle(64);
		this.listeners.anyClick = (event) => {
			this.windowClickEvent(event);
		};
		window.addEventListener("click", this.listeners.anyClick);
	},

	reset: function () {
		this.char.reset();
	},

	end: function () {
		this.container.style.backgroundImage = "";
		this.container.style.backgroundSize = "";
		window.removeEventListener("click", this.listeners.anyClick);
	},

	resize: function (viewport) {
		const {
			x: charX,
			y: charY,
			height: charH,
			width: charW,
		} = this.char.getRect();
		if (charX + charW > viewport.width) {
			this.char.setPositionX(viewport.width - charW);
		}
		if (charY + charH > viewport.height) {
			this.char.setPositionY(viewport.height - charH);
		}
	},

	setupBuildings: function (buildings) {
		Array.from(buildings).forEach((element) => {
			element.addEventListener("click", (event) => {
				this.windowClickEvent(event);
				this.buildingClickEvent(element);
			});
		});
	},

	buildingClickEvent: function (element) {
		this.char.block = true;
		this.char.movement.onfinish = (e) => {
			this.changeScreen(element.id);
		};
	},

	windowClickEvent: function (event) {
		this.char.clickIn(event.x, event.y);
	},
};

Object.assign(START, calls);

export default START;
