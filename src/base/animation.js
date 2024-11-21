import { toPxStyle } from "../utils.js"

export default class SpriteAnimation{

    constructor(sheetUrl, frameCount=1, duration=1.0, loop=false){
        this.imageSrc = sheetUrl
        this.frameCount = frameCount
        this.duration = duration
        console.log(this)
    }

    runAnimationIn(object) {
        if(this.frameCount <= 0){
            return
        }

        if(this.frameCount > 1){
            const frames = this.#generateAnimationFrames()
            console.log(frames)
            const options = {
                duration : this.duration*1000,
                iterations: this.loop ? Infinity : 1
            }
            object.animate(frames, options)
        } else {
            //1 Frame animations always will count as looping images
            object.style.backgroundImage = `url(${this.imageSrc})`
        }
        
    }

    #generateAnimationFrames(){
        let frames = []
        const img = new Image();
        img.src = this.imageSrc;
        const divider = img.naturalWidth/this.framesCount;
        //FIXME naturalWidth need the image visible on browser
        console.log(img.naturalWidth, divider, this.imageSrc)
        for(let i = 0; i<this.framesCount; i++){
            frames.push({
                backgroundImage: `url(${this.imageSrc})`,
                backgroundPosition: `0px ${toPxStyle(i*divider)}`
            });
        }
        return frames;
    }
}