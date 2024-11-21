import SpriteAnimation from "./base/animation.js";

export const GM3_SPRITES = {
    width: 79,
    height: 107,
    animations: {
        idle: new SpriteAnimation('assets/gm3_stand.png'),
        walk: new SpriteAnimation('assets/gm3_walk.png', 3, 1, true)
    }

};