import Place from "../../base/screen.js";
import Char from "../../base/char.js";
import { CV_SPRITES, GM3_SPRITES } from "../../constants.js";
import {
	generateRandomFrom,
	getAge,
	randomInt,
	toPercentageStyle,
	generateSprite,
} from "../../utils.js";

const LEVELS = {
	PERSONAL: "personal",
	EDUCATION: "education",
	JOB: "job",
};

export const CV_KEY = "cv";
const CV_PATH = "src/screens/cv/cv.html";
const CV = new Place(CV_KEY, CV_PATH);
CV.exp = 0;
CV.level = 1;
CV.tutorialMessage = `This is my Interactive CV. Click on the timeline on the left to
	get my education and professional experiences from that period of time.`;
CV.start = onStart;

function onStart() {
	setupMiniChar.call(this);
	this.currentLevel = -1;
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
	this.mini_char.holder.style.top = "85%";
	this.mini_char.holder.style.left = "30px";
}

function setupPage() {
	this.timeline = document.getElementsByTagName("timeline")[0];
	addLevel(LEVELS.PERSONAL);
	for (let e of this.cv.education) {
		this.lastYear = e.begin_time.split("/")[1];
		addTimeDot.call(this, this.lastYear);
		addLevel(LEVELS.EDUCATION);
	}
	for (let e of this.cv.experience) {
		this.lastYear = e.begin_time.split("/")[1];
		addTimeDot.call(this, this.lastYear);
		addLevel(LEVELS.JOB);
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
	const level = generateFloor(type);
	content.appendChild(level);
}

function generateFloor(type) {
	const floor = document.createElement("floor");
	const desk = generateDesk();
	switch (type) {
		case LEVELS.PERSONAL:
			console.log("p");
			break;
		case LEVELS.EDUCATION:
			console.log("e");
			break;
		case LEVELS.JOB:
			console.log("j");
			break;
	}

	floor.appendChild(desk);
	return floor;
}

function generateDesk() {
	const desk = document.createElement("div");
	desk.className = "desk";
	const table = document.createElement("div");
	const pc = document.createElement("div");
	pc.appendChild(generateSprite(CV_SPRITES.pc_sprite_url));
	//TODO
	desk.appendChild(pc);
	desk.appendChild(table);
	return desk;
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

	if (level === 0) {
		personalLevel.call(this);
	} else if (level === 1) {
		educationLevel.call(this);
	} else {
		professionalLevel.call(this, level - 2);
	}

	if (this.currentLevel === -1) {
		this.binding.infoPanel.innerHTML = this.info;
	} else {
		moveFloors.call(this, level).then(() => {
			this.binding.infoPanel.innerHTML = this.info;
		});
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
	this.info = `<h3>Personal Info:</h3>
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
	this.info = `<h3>Education:</h3>
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
	this.info = `<h3>${professionalInfo.company}</h3>
	${professionalInfo.title}

	<ul>
	${getAllJobTopicsAsLi(professionalInfo.stuff)}
	</ul>

	<b>Started:</b> ${professionalInfo.begin_time}
	<b>Ended:</b> ${professionalInfo.end_time}`;
}

function moveFloors(level) {
	return new Promise((res, rej) => {
		const floors = document.getElementsByTagName("floor");
		for (let f of floors) {
			f.style.top = toPercentageStyle(level * 100);
		}

		const randomLengths = {
			title: randomInt(30, 5),
			body: randomInt(250, 750),
		};
		const jumbleInterval = setInterval(() => {
			jumbleLetters.call(this, randomLengths.title, randomLengths.body);
		}, 100);

		floors[0].addEventListener("transitionend", () => {
			clearInterval(jumbleInterval);
			res();
		});
	});
}

function jumbleLetters(titleRandomLength, bodyRandomLegth) {
	const letters = "abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numbers = "0123456789";
	const symbols = "?!=@#$%&*+";

	const title = `<h3>${generateRandomFrom(letters, titleRandomLength)} </h3>`;
	const body = generateRandomFrom(
		letters + numbers + symbols,
		bodyRandomLegth
	);
	const dates = `<b>Started:</b> ${generateRandomFrom(
		numbers,
		2
	)}/${generateRandomFrom(numbers, 4)}
	<b>Ended:</b> ${generateRandomFrom(numbers, 2)}/${generateRandomFrom(
		numbers,
		4
	)}`;

	this.binding.infoPanel.innerHTML = title + "\n" + body + "\n\n" + dates;
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

export default CV;
