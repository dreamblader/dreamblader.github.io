import { toPxStyle } from "../utils.js";

export function attachAnimatedTextTo(holder, text) {
	let spacingPx = 20;
	for (const c of text) {
		let letter = document.createElement("span");

		if (c === " ") {
			letter.style.width = toPxStyle(spacingPx);
		} else {
			letter.innerHTML = c;
		}

		letter.style.display = "inline-block";

		holder.appendChild(letter);
		spacingPx = letter.getBoundingClientRect().width;
	}
	const allLetters = holder.children;
	return {
		animate: function (name, duration = 1) {
			const durationPerLetter = (duration * 1000) / allLetters.length;
			let i = 0;
			for (const l of allLetters) {
				const thisTiming = i * durationPerLetter;
				const divider = l.style.animation.length > 0 ? "," : "";
				l.style.animation +=
					divider +
					`${name} ${duration}s linear ${thisTiming}ms infinite`;
				i++;
			}
			return this;
		},
		stop: function () {
			for (const l of allLetters) {
				l.style.animation = "none";
			}
		},
	};
}
