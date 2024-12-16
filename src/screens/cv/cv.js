import Place from "../../base/screen.js";
import Char from "../../base/char.js";
import { GM3_SPRITES } from "../../constants.js";
import { toPxStyle } from "../../utils/utils.js";

export const CV_KEY = "cv";
const CV_PATH = "src/screens/cv/cv.html";
const CV = new Place(CV_KEY, CV_PATH);
CV.tutorialMessage = `This is my Interactive CV. Click on the timeline on the left to
	get my education and professional experiences from that period of time.

	This module is also under construction. But if you're seeing this that means that I'm currently working on it.

	Backlog:
	- Make the timeline interact with the fecthed API data from data dir 
	- Make the page look cool and animated`;
CV.start = onStart;

function onStart() {
	setupMiniChar.call(this);
	fetch("data/en/cv.json")
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP Error! Status: ${res.status}`);
			}
			return res.json();
		})
		.then((data) => {
			this.cv = data;
			setCVLevel.call(this, 0);
		})
		.catch((error) => {
			console.error(error);
		});
}

function setupMiniChar() {
	const char_holder = document.getElementById("mini-char");
	this.mini_char = new Char(char_holder, GM3_SPRITES);
	this.mini_char.holder.style.top = "95%";
	this.mini_char.holder.style.right = "-70%";
	this.mini_char.spriteHolder.style.scale = 2;
}

function setCVLevel(level) {
	switch (level) {
		case 0:
			personalLevel.call(this);
	}
	console.log(level);
}

function personalLevel() {}

export default CV;
