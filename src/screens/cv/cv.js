import Place from "../../base/screen.js";
import Char from "../../base/char.js";
import { GM3_SPRITES } from "../../constants.js";

export const CV_KEY = "cv";
const CV_PATH = "src/screens/cv/cv.html";
const CV = new Place(CV_KEY, CV_PATH);
CV.start = onStart;

function onStart() {
	const char_holder = document.getElementById("mini-char");
	this.mini_char = new Char(char_holder, GM3_SPRITES);
}

export default CV;
