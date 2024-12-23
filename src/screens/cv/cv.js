import Place from "../../base/screen.js";
import Char from "../../base/char.js";
import { GM3_SPRITES } from "../../constants.js";
import { getAge, toPxStyle } from "../../utils/utils.js";

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
	this.info = document.getElementById("info-panel");
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
			setupPage.call(this);
			setCVLevel.call(this, 0);
		})
		.catch((error) => {
			console.error(error);
		});
}

function setupMiniChar() {
	const char_holder = document.getElementById("mini-char");
	let mini_gm3 = { ...GM3_SPRITES };
	mini_gm3.scale = 2;
	this.mini_char = new Char(char_holder, mini_gm3);
	this.mini_char.holder.style.top = "785px";
	this.mini_char.holder.style.left = "30px";
}

function setupPage() {
	this.timeline = document.getElementsByTagName("timeline")[0];
	for (let e of this.cv.education) {
		this.lastYear = e.begin_time.split("/")[1];
		addTimeDot.call(this, this.lastYear);
	}
	for (let e of this.cv.experience) {
		this.lastYear = e.begin_time.split("/")[1];
		addTimeDot.call(this, this.lastYear);
	}

	let currentYear = new Date().getFullYear();

	if (this.lastYear !== currentYear) {
		addTimeDot.call(this, currentYear);
	}

	getFloorYTreshold.call(this);

	this.timeline.addEventListener("click", (e) => {
		timelineClick.call(this, e.target.className, e.y);

		this.mini_char.clickIn(null, e.y);
	});
}

function timelineClick(targetClass, targetY) {
	if (targetClass === "me") {
		setCVLevel.call(this, 0);
	} else {
		let level = 0;
		for (let t of this.yTreshholds) {
			console.log(targetY);
			if (targetY >= t) {
				setCVLevel.call(this, level);
				break;
			} else {
				level++;
			}
		}
	}
}

function addTimeDot(year) {
	const dot = document.createElement("time-dot");
	dot.innerHTML = year;
	this.timeline.appendChild(dot);
}

function getFloorYTreshold() {
	const dots = document.getElementsByTagName("time-dot");
	this.yTreshholds = [];
	for (let dot of dots) {
		if (dot.innerHTML <= this.lastYear) {
			let { y, height } = dot.getBoundingClientRect();
			this.yTreshholds.push(y + height);
		} else {
			this.yTreshholds.push(0);
			break;
		}
	}
}

function setCVLevel(level) {
	console.log(level);
	if (level === 0) {
		personalLevel.call(this);
	} else if (level === 1) {
		educationLevel.call(this);
	} else {
		professionalLevel.call(this, level - 2);
	}
}

function personalLevel() {
	this.info.style.backgroundColor = "white";
	this.info.style.borderColor = "black";
	this.info.style.borderRadius = "5%";
	this.info.innerHTML = `<h3>Personal Info:</h3>
	<b>Name:</b> ${this.cv.personal.name}
	<b>Nationality:</b> ${this.cv.personal.nacionality}
	<b>Age:</b> ${getAge(this.cv.personal.birthdate)}

	${this.cv.personal.intro}
	
	I can speak:
	${getLanguages(this.cv.personal.languages)}`;
}

function educationLevel() {
	//TODO
}

function professionalLevel() {
	//TODO
}

function getLanguages(langs) {
	let res = "";
	for (let l of langs) {
		res += `<img src='${l.flag}' style='scale:2; margin:10px 20px; transform-origin: top'/>${l.lang} (${l.level}) \n`;
	}
	return res;
}

//TODO add bottom + 100% to the elements to scroll them to the level that you need

export default CV;
