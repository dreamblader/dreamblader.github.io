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
		this.block = false;
		this.animate("idle");
	}

	setPosition(posX, posY) {
		this.holder.style.left = posX;
		this.holder.style.top = posY;
	}

	clickIn(posX, posY) {
		if (this.block) {
			return;
		}

		if (this.clickedMe(posX, posY) && !this.jumpMovement) {
			this.jump();
			console.log("YO");
		} else if (!this.jumpMovement) {
			this.moveTo(posX, posY);
		}
	}

	reset() {
		this.block = false;
		this.animate("idle");
	}

	jump() {
		this.animate("jump");
		const jumpPower = 45;
		const { y: myY } = this.getPos();
		const frames = [
			{
				top: toPxStyle(myY),
			},
			{
				top: toPxStyle(myY - jumpPower),
			},
			{
				top: toPxStyle(myY),
			},
		];
		const duration = {
			duration: 500,
		};
		this.jumpMovement = this.holder.animate(frames, duration);
		this.jumpMovement.onfinish = (e) => {
			this.animate("idle");
			this.jumpMovement = null;
		};
	}

	moveTo(posX, posY) {
		if (this.movement) {
			this.movement.onfinish = null;
		}

		this.animate("walk");

		const { x: myX, y: myY } = this.getPos();
		const { x: xOffset, y: yOffset } = this.#getCenterOffset();
		if (posX) {
			this.changeDirection(myX <= posX ? 1 : -1);
		}
		const frames = [
			{
				left: toPxStyle(myX),
				top: toPxStyle(myY),
			},
			{
				left:
					posX !== null ? toPxStyle(posX - xOffset) : toPxStyle(myX),
				top: posY !== null ? toPxStyle(posY - yOffset) : toPxStyle(myY),
			},
		];
		const duration = {
			duration: 1000,
			fill: "forwards",
		};

		this.movement = this.holder.animate(frames, duration);
		this.movement.onfinish = (e) => {
			this.animate("idle");
			this.movement = null;
		};
	}

	changeDirection(xDir = 1, yDir = 1) {
		this.spriteHolder.style.scale = `${xDir * this.sprite.scale} ${
			yDir * this.sprite.scale
		}`;
	}

	clickedMe(posX, posY) {
		let rect = this.getRect();
		const isInX = posX >= rect.x && posX <= rect.x + rect.width;
		const isInY = posY >= rect.y && posY <= rect.y + rect.height;
		return isInX && isInY;
	}

	animate(name) {
		if (this.currentAnimation === this.sprite.animations[name]) {
			return;
		}

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

	getOriginPos() {}

	getPos() {
		const rect = this.getRect();
		const pos = {
			x: rect.x,
			y: rect.y,
		};
		return pos;
	}

	#getCenterOffset() {
		let rect = this.getRect();
		const pos = {
			x: rect.width / 2,
			y: rect.height / 2,
		};
		return pos;
	}

	free() {
		this.holder = null;
		this.sprite = null;
		this.spriteHolder = null;
		this.block = false;
		if (this.currentAnimation !== undefined) {
			this.currentAnimation.stop();
		}
	}
}
