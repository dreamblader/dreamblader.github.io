import SpriteAnimation from "./base/animation.js";
import START, { START_KEY } from "./screens/start/start.js";
import CV from "./screens/cv/cv.js";

export const CHANGE_PLACE_EVENT_NAME = "change-place";

export const GM3_SPRITES = {
	width: 20,
	height: 20,
	scale: 5,
	animations: {
		idle: new SpriteAnimation("assets/gm3-stand.png"),
		walk: new SpriteAnimation("assets/gm3-walk.png", 3, 0.35, true),
		jump: new SpriteAnimation("assets/gm3-jump.png"),
	},
};

//CLASS THIS
export const SCREENS = {
	[START_KEY]: START,
	cv: CV,
	play: "screens/playground.html",
	home: "screens/home.html",
	project: "screens/projects.html",
	game: { url: "https://dreamblader.github.io/dreamblade/" },
};
