let glutil = require("./browser_modules/WebGLUtil.js");
let webgl = new glutil.WebGLUtil();

let SceneManager = require("./browser_modules/SceneManager.js");
let sceneManager = new SceneManager();


window.addEventListener("load",(e)=>{
    // smartDeviceDirection();

    let c = document.getElementsByTagName("canvas");

    let HammerSetting = require("./browser_modules/HammerSetting.js");
    let hammer = new HammerSetting(c[0]);

    hammer.freeMove("canvas",(unit,kind,e,volume)=>{
        if(unit === "canvas"){
            sceneManager.hammer(unit,kind,e,volume);
        }
    });

    webgl.init("canvas");
    // let innerWidth = window.innerWidth;
    // let innerHeight = window.innerHeight;
    // let screenWidth = screen.width;
    // let screenHeight = screen.height;
    // console.log({innerWidth,innerHeight,screenWidth,screenHeight});

    webgl.setCanvasSize(800,600);


    let Game = require("./scene/Game/Game.js");
    sceneManager.addScene({
        name : "Game",
        instance : new Game(webgl,sceneManager)
    });

    sceneManager.init();

    sceneManager.initScene("Game");


    let timerFunc = ()=>{
        webgl.preDraw();

        sceneManager.drawBackground();
        webgl.flush();

        sceneManager.drawPerspective();
        webgl.flush();

        sceneManager.drawUI();
        webgl.flush();

        sceneManager.timer();
        webgl.flush();

        requestAnimationFrame(timerFunc);	
    }
    timerFunc();

},false);


window.addEventListener("orientationchange",(e)=>{
    // smartDeviceDirection();
},false);

let smartDeviceDirection = ()=>{
    let body = document.getElementsByTagName("body")[0];

    if(window.orientation === 0){
        console.log("tate");
        body.style.backgroundColor = "red";
    }else if(window.orientation === 90){
        console.log("yoko");
        body.style.backgroundColor = "blue";
    }else if(window.orientation === 180){
        console.log("tate");
        body.style.backgroundColor = "white";
    }else if(window.orientation === -90){
        console.log("yoko");
        body.style.backgroundColor = "green";
    }
}