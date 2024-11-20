import {toPxStyle} from "./utils.js"

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

function moveCharTo(posX, posY){
    //FIXME FIRST 50% 50% make it jump and then its ok
    //Add offset to the center
    //Add walking animation while performing the transtion
    const frames = [
        // {
        //     left: char.style.left,
        //     top: char.style.top
        // },
        {
            left: toPxStyle(posX),
            top: toPxStyle(posY)
        }
    ]
    const duration = {
        duration: 1000,
        fill: "forwards"

    }
    char.animate(frames, duration);
}

window.addEventListener("click", event => {
    
    //char.style.top = event.y+'px';
    //char.style.left = event.x+'px';
    moveCharTo(event.x, event.y);
    
    

    console.log(event.x, event.y);
})


