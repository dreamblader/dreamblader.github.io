import { toPxStyle } from "../utils.js";

export function paintAt(posX, posY) {
	const t = document.createElement("div");
	t.style.background = "red";
	t.style.width = "4px";
	t.style.height = "4px";
	t.style.position = "absolute";
	t.style.top = toPxStyle(posY);
	t.style.left = toPxStyle(posX);
	container.append(t);
}
