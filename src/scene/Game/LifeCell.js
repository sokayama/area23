class LifeCell{
    constructor(webgl){
        this.webgl = webgl;
        console.log("LifeCell");
        this.location = [];

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

        this.redTexture = null;
        this.greenTexture = null;
    }

    getState(){
        return this.state;
    }

    setFieldSize(col,row){
        this.fieldSize.col = col;
        this.fieldSize.row = row;
    }

    async init(translate){
        this.glGenerate(translate);
        this.redTexture = await this.model.createTexture("./img/redcell.png");
        this.greenTexture = await this.model.createTexture("./img/greencell.png");

        this.model.bindTextureInfo(this.redTexture);
    }

    cleanupSurround(){
        this.surround = [];
    }

    addSurround(cell){
        console.log()
        if(cell){
            this.surround.push(cell);
        }else{
        }
    }

    nextTurn(){
        if(this.state.live){
            this.state.age++;

            if(this.state.age > 10){
                this.forceKill();
            }

        }else{
            let count = 0;
            for(let i in this.surround){
                // console.log(this.surround)
                // console.log("turnelse",this.surround[i])
                if(this.surround[i].state.live === true){
                    count++;
                }
            }
            if(count > 3){
                console.log("@@@@@")

                this.forceSpawn();
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
        this.model.bindTextureInfo(this.greenTexture);
        this.state.live = true;
        this.state.age = 0;
    }

    forceKill(){
        this.model.bindTextureInfo(this.redTexture);
        this.state.live = false;
    }

    glGenerate(translate){

        let scale = 1.0;
        let glutil = require("./../../browser_modules/WebGLUtil.js");

        this.model = new glutil.OrthoModel(this.webgl);
        this.model.createPlate(require("./../../const.vert"),require("./../../const.frag"));
        // console.log({texturePath,translate})
        
        this.model.setScale([scale,scale,1.0,1.0]);
        this.model.setTranslatePixel(translate[0],translate[1]);
    }
}
module.exports = LifeCell;