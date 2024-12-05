import SpriteAnimation from "./base/animation.js";

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
