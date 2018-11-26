class Game{
    constructor(webgl,sceneManager){
        console.log("yaya");
        const LifeCell = require("./LifeCell.js");
        this.lifeCell = new LifeCell(webgl);
    }
    init(){
    }
    moveIn(){
    
    }

    timer(){

    }

    drawUI(){
        this.lifeCell.model.draw();
    }

    hammer(unit,kind,e,volume){
        if(kind === "TAP"){
            let mouse_location = {
                x:e.srcEvent.layerX,
                y:e.srcEvent.layerY
            }

            this.lifeCell.model.getTouchCollision(mouse_location,()=>{
                console.log("tap tap");
            })
        }
    }


    moveOut(){

    }
}
module.exports = Game;