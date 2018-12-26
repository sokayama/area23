// フィールドの大きさ
const LIFECELL_COL = 9;
const LIFECELL_ROW = 9;
const LIFECELL_MAX = LIFECELL_COL * LIFECELL_ROW;

class Game{
    constructor(webgl,sceneManager){
        console.log("yaya");
        const LifeCell = require("./LifeCell.js");
        
        this.lifeCell = [];

        for(let i=0;i<LIFECELL_MAX;i++){
            this.lifeCell[i] = new LifeCell(webgl);
            this.lifeCell[i].setFieldSize(LIFECELL_COL,LIFECELL_ROW);
        }

        this.counter = 0;
    }

    init(){
        let boardMargin= {
            x : 500,
            y : 400
        }
        for(let i=0;i<LIFECELL_MAX;i++){
            this.lifeCell[i].location[0] = (i % LIFECELL_COL)
            let x = (this.lifeCell[i].location[0] * 205) + boardMargin.x;

            this.lifeCell[i].location[1] = Math.floor(i / LIFECELL_COL)
            let y = (this.lifeCell[i].location[1] * 205) + boardMargin.y;

            this.lifeCell[i].init([x,y,0.0,0.0]);
        }

        for(let i=0;i<LIFECELL_MAX;i++){
            if(i%LIFECELL_COL - 1 >= 0){
                this.lifeCell[i].addSurround(this.lifeCell[i-1]);
            }

            if(i%LIFECELL_COL + 1 <= LIFECELL_COL){
                this.lifeCell[i].addSurround(this.lifeCell[i+1]);
            }

            if(i-LIFECELL_COL >= 0){
                this.lifeCell[i].addSurround(this.lifeCell[i-LIFECELL_COL]);
            }

            if(i+LIFECELL_COL <= LIFECELL_MAX){
                this.lifeCell[i].addSurround(this.lifeCell[i+LIFECELL_COL]);
            }

            if(i%LIFECELL_COL - 1 >= 0){
                if(i-LIFECELL_COL >= 0){
                    this.lifeCell[i].addSurround(this.lifeCell[i-LIFECELL_COL-1]);
                }
    
                if(i+LIFECELL_COL <= LIFECELL_MAX){
                    this.lifeCell[i].addSurround(this.lifeCell[i+LIFECELL_COL-1]);
                }
            }

            if(i+LIFECELL_COL <= LIFECELL_MAX){
                if(i-LIFECELL_COL >= 0){
                    this.lifeCell[i].addSurround(this.lifeCell[i-LIFECELL_COL+1]);
                }
    
                if(i+LIFECELL_COL <= LIFECELL_MAX){
                    this.lifeCell[i].addSurround(this.lifeCell[i+LIFECELL_COL+1]);
                }
            }

        }
    }

    moveIn(){
    
    }

    timer(){
        this.counter++;
        if(this.counter % 100 === 0){
            for(let i in this.lifeCell){
                this.lifeCell[i].nextTurn();
            }            
        }
    }

    surroundFunc(){
        for(let i in this.lifeCell){
            
        }
    }

    drawUI(){
        for(let i=0;i<LIFECELL_MAX;i++){
            this.lifeCell[i].model.draw();
        }
    }

    hammer(unit,kind,e,volume){
        if(kind === "TAP"){
            let mouse_location = {
                x:e.srcEvent.layerX,
                y:e.srcEvent.layerY
            }

            for(let i=0;i<LIFECELL_MAX;i++){
                this.lifeCell[i].model.getTouchCollision(mouse_location,()=>{
                    console.log("tap",i);
                    this.lifeCell[i].click();
                });
            }
        }
    }


    moveOut(){

    }
}
module.exports = Game;