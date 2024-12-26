import Place from "../../base/screen.js";
import Char from "../../base/char.js";
import { GM3_SPRITES } from "../../constants.js";
import { getAge, toPercentageStyle, toPxStyle } from "../../utils/utils.js";

export const CV_KEY = "cv";
const CV_PATH = "src/screens/cv/cv.html";
const CV = new Place(CV_KEY, CV_PATH);
CV.tutorialMessage = `This is my Interactive CV. Click on the timeline on the left to
	get my education and professional experiences from that period of time.

	This module is also under construction. But if you're seeing this that means that I'm currently working on it.

	Backlog:
	- Make the floors move in between
	- Make backgrounds for each floor and maybe a recolor for the job ones (check tint?)
	- Make letters 'jumble' when moving floors`;
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
			setupPage.call(this);
			setCVLevel.call(this, 0);
		})
		.catch((error) => {
			console.error(error);
		});
}

function setupMiniChar() {
	const char_holder = this.binding.miniChar;
	let mini_gm3 = { ...GM3_SPRITES };
	mini_gm3.scale = 2;
	this.mini_char = new Char(char_holder, mini_gm3);
	this.mini_char.holder.style.top = "785px";
	this.mini_char.holder.style.left = "30px";
}

function setupPage() {
	this.timeline = document.getElementsByTagName("timeline")[0];
	addLevel("personal");
	for (let e of this.cv.education) {
		this.lastYear = e.begin_time.split("/")[1];
		addTimeDot.call(this, this.lastYear);
		addLevel("education");
	}
	for (let e of this.cv.experience) {
		this.lastYear = e.begin_time.split("/")[1];
		addTimeDot.call(this, this.lastYear);
		addLevel("job");
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

function addLevel(type) {
	const content = document.getElementsByClassName("cv-content")[0];
	const level = document.createElement("floor");
	level.innerHTML = type;
	content.appendChild(level);
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
	if (this.currentLevel === level) {
		return;
	}

	moveFloors.call(this, level);

	if (level === 0) {
		personalLevel.call(this);
	} else if (level === 1) {
		educationLevel.call(this);
	} else {
		professionalLevel.call(this, level - 2);
	}

	this.currentLevel = level;
}

function personalLevel() {
	const personalInfo = this.cv.personal;
	this.binding.infoPanel.style.backgroundColor = "white";
	this.binding.infoPanel.style.borderColor = "black";
	this.binding.infoPanel.style.borderRadius = toPercentageStyle(5);
	this.binding.infoPanel.style.color = "black";
	this.binding.infoPanel.style.fontFamily = "Roboto";
	this.binding.infoPanel.innerHTML = `<h3>Personal Info:</h3>
	<b>Name:</b> ${personalInfo.name}
	<b>Nationality:</b> ${personalInfo.nacionality}
	<b>Age:</b> ${getAge(personalInfo.birthdate)}

	${personalInfo.intro}
	
	I can speak:
	${getLanguages(personalInfo.languages)}`;
}

function educationLevel() {
	const educationInfo = this.cv.education[0];
	this.binding.infoPanel.style.backgroundColor = "rgb(39, 76, 67)";
	this.binding.infoPanel.style.borderColor = "brown";
	this.binding.infoPanel.style.borderRadius = "0";
	this.binding.infoPanel.style.color = "white";
	this.binding.infoPanel.style.fontFamily = "Eraser";
	this.binding.infoPanel.innerHTML = `<h3>Education:</h3>
	<b>Graduate at:</b> 
	${educationInfo.institution}

	<b>With:</b> 
	${educationInfo.title}

	<b>Started:</b> ${educationInfo.begin_time}
	<b>Ended:</b> ${educationInfo.end_time}`;
}

function professionalLevel(relativeLevel) {
	const professionalInfo = this.cv.experience[relativeLevel];
	this.binding.infoPanel.style.backgroundColor = "black";
	this.binding.infoPanel.style.borderColor = "gray";
	this.binding.infoPanel.style.borderRadius = "0";
	this.binding.infoPanel.style.color = "white";
	this.binding.infoPanel.style.fontFamily = "Roboto";
	this.binding.infoPanel.innerHTML = `<h3>${professionalInfo.company}</h3>
	${professionalInfo.title}

	<ul>
	${getAllJobTopicsAsLi(professionalInfo.stuff)}
	</ul>

	<b>Started:</b> ${professionalInfo.begin_time}
	<b>Ended:</b> ${professionalInfo.end_time}`;
}

function moveFloors(level) {
	const floors = document.getElementsByTagName("floor");
}

function getLanguages(langs) {
	let res = "";
	for (let l of langs) {
		res += `<img src='${l.flag}' style='scale:2; margin:10px 20px; transform-origin: top'/>${l.lang} (${l.level}) \n`;
	}
	return res;
}

function getAllJobTopicsAsLi(topics) {
	let result = "";
	for (let t of topics) {
		result += `<li>${t}</li>`;
	}
	return result;
}

//TODO add bottom + 100% to the elements to scroll them to the level that you need

export default CV;
