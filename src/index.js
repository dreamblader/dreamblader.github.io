import toPxStyle from "./utils.js"

const char = document.getElementById("char");
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
    
    //char.style.top = event.y+'px';
    //char.style.left = event.x+'px';
    paintAt(event.x, event.y);
    
    

    console.log(event.x, event.y);
})

console.log("TESTER");