import { toPxStyle, generateAnimationFrames } from "../utils.js";

export default class Char{
    constructor(holder, sprite){
        this.holder = holder;
        this.sprite = sprite;
        this.holder.style.width = toPxStyle(sprite.width);
        this.holder.style.height = toPxStyle(sprite.height);
    }

    moveTo(posX, posY){
        //FIXME 
        //Add walking animation while performing the transtion
        const walkAnimation = this.sprite.animations['walk']
        if(walkAnimation != undefined){
            walkAnimation.runAnimationIn(this.holder)
        }
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
        this.holder.animate(frames, duration);
    }

    getRect(){
        return this.holder.getBoundingClientRect();
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