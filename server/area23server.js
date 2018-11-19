(()=>{
    let path = require("path");
    class Area23Server{
        constructor(){
            this.WebSocketServer = require(path.join(__dirname, "server_modules/WebSocketServer"));
            this.ws = new this.WebSocketServer();
            
            this.standbyTimer = 0;

            this.ws.listen(58081,(data,client)=>{
                if(data.type === "utf8"){
                    let res = JSON.parse(data.utf8Data);
                    this.sceneManager.websocket(res);
                    // console.log(res);
                }
            });    

            this.SceneManager = require(path.join(__dirname, "server_modules/SceneManager"));
            this.sceneManager = new this.SceneManager();

            this.sceneInit();
        }

        sceneInit(){
            this.Farm = require(path.join(__dirname, "scene/Farm"));
            this.sceneManager.addScene({
                name : "Farm",
                instance : new this.Farm(this.ws,this.sceneManager)
            });


            this.sceneManager.init();
            this.sceneManager.initScene("Farm");
        }
    }

    module.exports = Area23Server;
})();