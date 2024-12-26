import Place from "../../base/screen.js";
import { attachAnimatedTextTo } from "../../fun/letter-animation.js";

export const WORKING_KEY = "still-working";
const WORKING_PATH = "src/screens/err/working.html";
const WORKING = new Place(WORKING_KEY, WORKING_PATH);
WORKING.start = function () {
	this.char.holder.style.position = "static";
	this.char.holder.style.scale = "1.5";
	this.char.holder.style.marginTop = "20px";
	this.char.animate("jump");

	attachAnimatedTextTo(this.binding.moveMe, "Under Construction")
		.animate("wave")
		.animate("rainbow", 3);

	this.binding.warningSign.animate(
		[
			{
				rotate: "0deg",
				scale: 10,
			},
			{
				rotate: "15deg",
				scale: 8,
			},
			{
				rotate: "0deg",
				scale: 10,
			},
			{
				rotate: "-15deg",
				scale: 8,
			},
			{
				rotate: "0deg",
				scale: 10,
			},
		],
		{ duration: 3000, iterations: Infinity }
	);
};

export default WORKING;
