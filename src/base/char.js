import { toPxStyle, generateAnimationFrames } from "../utils.js";

export default class Char {
	constructor(holder, sprite) {
		this.holder = holder;
		this.sprite = sprite;
		this.holder.style.width = toPxStyle(sprite.width * sprite.scale);
		this.holder.style.height = toPxStyle(sprite.height * sprite.scale);
		this.spriteHolder = document.createElement("div");
		this.spriteHolder.style.width = toPxStyle(sprite.width);
		this.spriteHolder.style.height = toPxStyle(sprite.height);
		this.spriteHolder.style.scale = sprite.scale;
		this.holder.appendChild(this.spriteHolder);
		this.animate("idle");
	}

	moveTo(posX, posY) {
		//FIXME
		//Add walking animation while performing the transtion
		// if(this.movement !== null && this.movement !== undefined){
		//     this.movement.onfinish =
		// }

		this.animate("walk");
		const { x: myX, y: myY } = this.getPos();
		const { x: xOffset, y: yOffset } = this.getCenterOffset();
		const frames = [
			{
				left: toPxStyle(myX),
				top: toPxStyle(myY),
			},
			{
				left: toPxStyle(posX - xOffset),
				top: toPxStyle(posY - yOffset),
			},
		];
		console.log(
			[myX, myY],
			[posX - xOffset, posY - yOffset],
			this.getRect()
		);
		const duration = {
			duration: 1000,
			fill: "forwards",
		};

		// this.movement =
		this.holder.animate(frames, duration);
		// this.movement.onfinish = (e) => {
		//     this.animate('idle')
		//     this.movement = null
		// }
		this.holder.addEventListener;
	}

	animate(name) {
		if (this.currentAnimation !== undefined) {
			this.currentAnimation.stop();
		}

		if (name in this.sprite.animations) {
			this.currentAnimation = this.sprite.animations[name];
			this.currentAnimation.runAnimationIn(this.spriteHolder);
		}
	}

	getRect() {
		return this.holder.getBoundingClientRect();
	}

	getPos() {
		const rect = this.getRect();
		const pos = {
			x: rect.x,
			y: rect.y,
		};
		return pos;
	}

	getCenterOffset() {
		let rect = this.getRect();
		const pos = {
			x: rect.width / 2,
			y: rect.height / 2,
		};
		return pos;
	}
}
