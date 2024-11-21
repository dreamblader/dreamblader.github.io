import {toPxStyle} from "./utils.js"
import Char from "./char/char.js";

const char = new Char(document.getElementById("char"));
const container = document.getElementById("container");


function paintAt(posX, posY){
    const t = document.createElement("div");
    t.style.background = "red";
    t.style.width = "4px";
    t.style.height = "4px";
    t.style.position = "absolute";
    t.style.top = toPxStyle(posY);
    t.style.left = toPxStyle(posX);
    container.append(t);
}

window.addEventListener("click", event => {
    char.moveTo(event.x, event.y);
    
    

    console.log(event.x, event.y);
})


