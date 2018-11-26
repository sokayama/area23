class LifeCell{
    constructor(webgl){
        this.webgl = webgl;
        console.log("LifeCell");
        this.surround = [];
        this.state = {
            live : false,
            age : 0
        };

        this.model = null;

        this.init();
    }

    init(){
        this.glGenerate("./img/cell.png",[0.0,0.0,0.0,0.0]);
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

        let scale = this.webgl.c.width / 1000;
        let glutil = require("./../../browser_modules/WebGLUtil.js");

        this.model = new glutil.OrthoModel(this.webgl);
        this.model.createPlate(require("./../../const.vert"),require("./../../const.frag"));
        console.log({texturePath,translate})

        this.model.setTexture(texturePath,()=>{
            this.model.setUniform4("scale",[scale,scale,1.0,1.0]);
        });
        this.model.setUniform4("translate",translate);
    }
}
module.exports = LifeCell;