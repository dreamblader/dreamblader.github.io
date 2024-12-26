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
