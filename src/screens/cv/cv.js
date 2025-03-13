import Place from "../../base/screen.js";
import Char from "../../base/char.js";
import { CV_SPRITES, GM3_SPRITES } from "../../constants.js";
import {
	generateRandomFrom,
	getAge,
	randomInt,
	toPercentageStyle,
	generateSprite,
	getCenterofRect,
	toPxStyle,
} from "../../utils.js";

const LEVELS = {
	PERSONAL: "personal",
	EDUCATION: "education",
	JOB: "job",
};

const PACING_DISTANCE = 150;

export const CV_KEY = "cv";
const CV_PATH = "src/screens/cv/cv.html";
const CV = new Place(CV_KEY, CV_PATH);

CV.exp = 0;
CV.level = 1;
CV.tutorialMessage = `This is my Interactive CV. Click on the timeline on the left to
	get my education and professional experiences from that period of time.`;

const calls = {
	start: function () {
		this.loadIdleData();
		this.setupMiniChar();
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
				this.setupPage();
				this.setCVLevel(0);
				this.setupIdleEvent();
			})
			.catch((error) => {
				console.error(error);
			});
	},

	setupMiniChar: function () {
		const char_holder = this.binding.miniChar;
		const start_div = document.getElementsByClassName("me")[0];
		let mini_gm3 = { ...GM3_SPRITES };
		mini_gm3.scale = 2;
		this.mini_char = new Char(char_holder, mini_gm3);
		this.mini_char.setPosition(
			...getCenterofRect(start_div.getBoundingClientRect())
		);
	},

	setupPage: function () {
		this.timeline = document.getElementsByTagName("timeline")[0];
		this.addLevel(LEVELS.PERSONAL);
		for (let e of this.cv.education) {
			this.lastYear = e.begin_time.split("/")[1];
			this.addTimeDot(this.lastYear);
			this.addLevel(LEVELS.EDUCATION);
		}
		for (let e of this.cv.experience) {
			this.lastYear = e.begin_time.split("/")[1];
			this.addTimeDot(this.lastYear);
			this.addLevel(LEVELS.JOB);
		}

		let currentYear = new Date().getFullYear();

		if (this.lastYear !== currentYear) {
			this.addTimeDot(currentYear);
		}

		this.getFloorYTreshold();

		this.timeline.addEventListener("click", (e) => {
			this.timelineClick(e.target.className, e.y);

			this.mini_char.clickIn(null, e.y);
		});
	},

	setupIdleEvent: function () {
		let dir = 1;
		let count = 0;
		const floor = document
			.getElementsByClassName("ground")[0]
			.getBoundingClientRect();
		this.char.setPositionY(floor.y - floor.height / 4);
		this.idleEvent = setInterval(() => {
			let next_x = this.char.getPos().x + PACING_DISTANCE * dir;
			//TODO Lock char animation in JUMP STATE
			this.char.moveTo(next_x, null);
			if (dir === -1) {
				this.addExp(this.currentLevel);
			}
			dir *= -1;
			count += 1;
			if (count >= 10) {
				count = 0;
				this.saveIdleData();
			}
		}, 2000);
	},

	timelineClick: function (targetClass, targetY) {
		if (targetClass === "me") {
			this.setCVLevel(0);
		} else {
			let level = 0;
			for (let t of this.yTreshholds) {
				if (targetY >= t) {
					this.setCVLevel(level);
					break;
				} else {
					level++;
				}
			}
		}
	},

	addTimeDot: function (year) {
		const dot = document.createElement("time-dot");
		dot.innerHTML = year;
		this.timeline.appendChild(dot);
	},

	addLevel: function (type) {
		const content = document.getElementsByClassName("cv-content")[0];
		const level = this.generateFloor(type);
		content.appendChild(level);
	},

	generateFloor: function (type) {
		const floor = document.createElement("floor");
		const wall = document.createElement("div");
		const ground = document.createElement("div");

		wall.className = "wall " + type;
		ground.className = "ground " + type;

		floor.appendChild(wall);
		floor.appendChild(ground);

		if (type !== LEVELS.PERSONAL) {
			floor.appendChild(this.generateDesk());
		}

		return floor;
	},

	generateDesk: function () {
		const desk = document.createElement("div");
		desk.className = "desk";
		const table = generateSprite(CV_SPRITES.table_sprite_url);
		table.style.pointerEvents = "none";
		const pc = generateSprite(CV_SPRITES.pc_sprite_url);
		pc.className = "exp-click";
		pc.addEventListener("click", (e) => {
			const frames = [
				{
					scale: 3,
				},
				{
					scale: 2.75,
				},
				{
					scale: 3,
				},
			];
			const duration = {
				duration: 300,
			};
			pc.animate(frames, duration);
			this.addExp(this.currentLevel);
		});
		desk.appendChild(pc);
		desk.appendChild(table);
		return desk;
	},

	addExp: function (value) {
		this.exp += value;
		const nextLevel = 10 + Math.floor(this.level * 30 * 1.25);
		const progressPercent = Math.min(
			Math.round((this.exp / nextLevel) * 100),
			100
		);
		this.binding.progress.style.width = toPercentageStyle(progressPercent);
		this.binding.progressbar.children.item(0).textContent =
			toPercentageStyle(progressPercent);
		if (this.exp >= nextLevel) {
			this.level += 1;
			this.binding.lv.textContent = `Level ${this.level}`;
			const overValue = (this.exp -= nextLevel);
			this.exp = 0;
			this.addExp(overValue);
		}
	},

	getFloorYTreshold: function () {
		//FIXME this need to change on screen changing event
		const dots = document.getElementsByTagName("time-dot");
		this.yTreshholds = [];
		for (let dot of dots) {
			if (dot.innerHTML <= this.lastYear) {
				let { y, height } = dot.getBoundingClientRect();
				this.yTreshholds.push(y + height);
				console.log(dot, y, height);
			} else {
				this.yTreshholds.push(0);
				break;
			}
		}
		console.log(this.yTreshholds); //FIXME Debug console Y
	},

	setCVLevel: function (level) {
		if (this.currentLevel === level) {
			return;
		}

		switch (level) {
			case 0:
				this.personalLevel();
				break;
			case 1:
				this.educationLevel();
				break;
			default:
				this.professionalLevel(level - 2);
				break;
		}

		if (this.currentLevel === -1) {
			this.binding.infoPanel.innerHTML = this.info;
		} else {
			moveFloors.call(this, level).then(() => {
				this.binding.infoPanel.innerHTML = this.info;
			});
		}

		this.currentLevel = level;
	},

	personalLevel: function () {
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
	},

	educationLevel: function () {
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
	},

	professionalLevel: function (relativeLevel) {
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
	},

	loadIdleData: function () {
		const loadXp = localStorage.getItem("xp");
		const loadLevel = localStorage.getItem("lv");
		if (loadLevel !== null) {
			this.level = Number(loadLevel);
			this.binding.lv.textContent = `Level ${this.level}`;
		}
		if (loadXp !== null) {
			this.exp = Number(loadXp);
			this.addExp(0);
		}
	},

	saveIdleData: function () {
		localStorage.setItem("xp", this.exp);
		localStorage.setItem("lv", this.level);
	},

	end: function () {
		this.saveIdleData();
		clearInterval(this.idleEvent);
		this.char.reset();
	},
};

Object.assign(CV, calls);

//TODO ADD ALL THESE FUNCTIONS ON CALLS OBJECT

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

/* FIXME
ERROR CALC Y THRESH
0
: 
745.6875
1
: 
643.40625
2
: 
541.125
3
: 
438.84375
4
: 
336.5625
5
: 
234.28125
6
: 
0

GOOD CALC Y:
0
: 
765.6875
1
: 
663.40625
2
: 
561.125
3
: 
458.84375
4
: 
356.5625
5
: 
254.28125
6
: 
0
*/
