import { toPxStyle } from "../utils.js";

export default class SpriteAnimation {
	constructor(sheetUrl, frameCount = 1, duration = 1.0, loop = false) {
		this.imageSrc = sheetUrl;
		this.frameCount = frameCount;
		this.duration = duration;
		this.loop = loop;
		this.running = false;
		this.#loadImageAttrs();
	}

	#loadImageAttrs() {
		return new Promise((res, rej) => {
			const img = new Image();
			img.onload = () => {
				this.widthDivider = img.naturalWidth / this.frameCount;
			};
			img.src = this.imageSrc;
		});
	}

	runAnimationIn(object) {
		//FIXME This is a reference and is coliding with both chars moving...
		if (this.frameCount <= 0) {
			return;
		}

		object.style.backgroundImage = `url(${this.imageSrc})`;

		if (!this.running) {
			this.currentFrame = 0;

			if (this.frameCount > 1) {
				const interval = (this.duration * 1000) / this.frameCount;
				this.animation = setInterval(() => {
					this.#draw(object);
				}, interval);
			}
			this.running = true;
		}
	}

	stop() {
		if (this.animation !== undefined) {
			clearInterval(this.animation);
		}
		this.running = false;
	}

	#draw(object) {
		object.style.backgroundPosition = this.#generateFramePosition(
			this.currentFrame
		);
		this.currentFrame = (this.currentFrame + 1) % this.frameCount;
		if (this.currentFrame === 0 && !this.loop) {
			clearInterval(this.animation);
		}
	}

	#generateFramePosition(frameIndex) {
		return `${toPxStyle(frameIndex * this.widthDivider)} 0px`;
	}
}
