class LifeCell{
    constructor(webgl){
        this.webgl = webgl;
        console.log("LifeCell");
        this.surround = [];
        this.state = {
            live : false,
            kind : null,
            age : 0
        };

        this.model = null;

        this.fieldSize = {
            col : 0,
            row : 0
        }
    }

    getState(){
        return this.state;
    }

    setFieldSize(col,row){
        this.fieldSize.col = col;
        this.fieldSize.row = row;
    }

    init(translate){
        this.glGenerate("./img/cell.png",translate);
    }

    cleanupSurround(){
        surrround = [];
    }

    addSurround(cell){
        surround.add(cell);
    }

    nextTurn(){
        if(this.state.live){
            this.state.age++;

            if(this.state.age > 10){
                this.forceKill();
            }

        }else{
            for(let i in this.surround){
                if(this.surround[i].state.kind === null){

                }
            }
        }
    }

    click(){
        if(this.state.live === true){
            this.forceKill();
        }else{
            this.forceSpawn();
        }
    }

    forceSpawn(){
        this.state.live = true;
        this.state.age = 0;
    }

    forceKill(){
        this.state.live = false;
    }

    glGenerate(texturePath,translate){

        let scale = 1.0;
        let glutil = require("./../../browser_modules/WebGLUtil.js");

        this.model = new glutil.OrthoModel(this.webgl);
        this.model.createPlate(require("./../../const.vert"),require("./../../const.frag"));
        // console.log({texturePath,translate})

        this.model.setTexture(texturePath,()=>{
            this.model.setScale([scale,scale,1.0,1.0]);
        });
        this.model.setTranslatePixel(translate[0],translate[1]);
    }
}
module.exports = LifeCell;