// export default class Utils {

// }

const STYLES = {
	PX: "px",
	PERCENTAGE: "%",
};

export function toPxStyle(val) {
	return toStyle(val, STYLES.PX);
}

export function toPercentageStyle(val) {
	return toStyle(val, STYLES.PERCENTAGE);
}

function toStyle(val, style) {
	return val + style;
}

export function generateSprite(imageURI) {
	const sprite = new Image();
	sprite.src = imageURI;
	return sprite;
}

export function generateAnimationFrames(imageURI, framesCount) {
	let frames = [];
	const img = new Image();
	img.src = imageURI;
	const divider = img.naturalWidth / framesCount;
	for (let i = 0; i < framesCount; i++) {
		frames.push({});
	}
	return frames;
}

export function getAge(date) {
	const diff = new Date(new Date() - new Date(date));
	return diff.getUTCFullYear() - 1970;
}

export function toCamelCase(val) {
	let words = val.split(/[_|-]/g);
	let result = words.shift();
	for (let w of words) {
		result += w.charAt(0).toUpperCase() + w.slice(1);
	}
	return result;
}

export function generateRandomFrom(token, length) {
	let res = "";
	for (let i = 0; i < length; i++) {
		let t = randomInt(0, token.length);
		res += token.charAt(t);
	}
	return res;
}

export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function isExternalLink(url) {
	return url.startsWith("http");
}

export function getCenterofRect(rect) {
	//TODO use this to get center of div elements to position char sprite
}
