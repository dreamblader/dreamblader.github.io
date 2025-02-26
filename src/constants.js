import SpriteAnimation from "./base/animation.js";
import START, { START_KEY } from "./screens/start/start.js";
import CV, { CV_KEY } from "./screens/cv/cv.js";
import WORKING from "./screens/err/working.js";

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

//TODO CLASS THIS
export const SCREENS = {
	[START_KEY]: START,
	[CV_KEY]: CV,
	play: WORKING,
	home: WORKING,
	project: WORKING,
	game: { url: "https://dreamblader.github.io/dreamblade/" },
};

export const CV_SPRITES = {
	pc_sprite_url: "assets/pc.png",
	table_sprite_url: "assets/table.png",
};
