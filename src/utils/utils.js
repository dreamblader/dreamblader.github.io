// export default class Utils {

// }

export function toPxStyle(val) {
	return val + "px";
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
