import Place from "../../base/screen.js";

export const WORKING_KEY = "still-working";
const WORKING_PATH = "src/screens/err/working.html";
const WORKING = new Place(WORKING_KEY, WORKING_PATH);
WORKING.start = function () {
	this.char.holder.style.position = "static";
};

export default WORKING;
