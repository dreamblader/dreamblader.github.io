import { toPxStyle, generateAnimationFrames } from "./utils.js";

export default class Char{
    static IDLE_STATE = 0;
    static WALK_STATE = 1;
    static JUMP_STATE = 2;
    
    constructor(sprite){
        this.sprite = sprite;
        this.state = this.IDLE_STATE;
        generateAnimationFrames("./assets/gm3-walk.png", 3)
    }

    moveTo(posX, posY){
        //FIXME 
        //Add walking animation while performing the transtion
        const {x: myX, y: myY} = this.getPos();
        const {x: xOffset, y: yOffset} = this.getCenterOffset();
        console.log(this.getCenterOffset())
        const frames = [
            {
                left: toPxStyle(myX),
                top: toPxStyle(myY)
            },
            {
                left: toPxStyle(posX-xOffset) ,
                top: toPxStyle(posY-yOffset)
            }
        ]
        const duration = {
            duration: 1000,
            fill: "forwards"
    
        }
        this.sprite.animate(frames, duration);
    }

    getRect(){
        return this.sprite.getBoundingClientRect();
    }

    getPos(){
        const rect = this.getRect();
        const pos = {
            x: rect.x,
            y: rect.y,
        }
        return pos;
    }

    getCenterOffset(){
        let rect = this.getRect();
        const pos = {
            x: (rect.width / 2),
            y: (rect.height / 2),
        }
        console.log(rect)
        return pos;
    }
    
}