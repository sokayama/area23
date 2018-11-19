class SceneManager {
    constructor(){
        this.scene = null; // 現在のシーン
        this.sceneData = []; // シーンリスト
    }

    /**
     * @method initScene 初期シーンを設定する
     * @param {object} initSceneName 初期シーンの名前
     * @return {bool} 成功したか
     */
    initScene(initSceneName){
        let initScene = this.getScene(initSceneName);
        if(!initScene){
            console.error("[Scene : initScene] 初期シーンがありません");
            return false;
        }else{
            console.log("[Scene : initScene] 初期シーンを設定します",initSceneName);
            this.scene = initScene;
            if("moveIn" in this.scene.instance){
                this.scene.instance.moveIn();
            }
            return true;
        }
    }

    /**
     * @method addScene シーンを追加する
     * @param {object} addScene 追加するシーン
     * @return {bool} 追加に成功したか
     */
    addScene(addScene){
        for(let i in this.sceneData){
            if(addScene.name === this.sceneData[i].name){
                console.log("[Scene : addScene] 既にこのシーンnameは存在します");
                return false;
            }
        }
        this.sceneData.push(addScene);
        return true;
    }

    /**
     * @method getScene シーンデータを取得する
     * @param {string} name シーン名
     * @return {object} シーンデータ
     */
    getScene(name){
        for(let i in this.sceneData){
            if(this.sceneData[i].name === name){
                return this.sceneData[i];
            }
        }
        console.log("[Scene : getScene] そのシーン[" + name + "]はありませんでした");
        return null;
    }

    /**
     * @method nowSceneName 現在のシーン名を取得する
     * @return {string} シーン名
     */
    nowSceneName(){
        return this.scene.name;
    }

    /**
     * @method changeScene シーンを変更する
     * @param {string} nextSceneName 変更先のシーン名
     * @return {bool} 変更に成功したか
     */
    changeScene(nextSceneName,moveInParam){
        let nextScene = this.getScene(nextSceneName);
        if(nextScene === this.scene){
            console.log("[Scene : changeScene] 現在のシーンと変更先のシーン " + this.scene.name + " が同じです");
            return false;
        }else{
            console.log("[Scene : changeScene] シーン変更します",nextScene.name);
            if("moveOut" in this.scene.instance){
                this.scene.instance.moveOut();
            }
            this.scene = nextScene;
            if("moveIn" in this.scene.instance){
                this.scene.instance.moveIn(moveInParam);
            }
            this.timerChange = 0;
        }
    }

    init(){
        for(let i in this.sceneData){
            if("init" in this.sceneData[i].instance){
                this.sceneData[i].instance.init();
            }
        }
    }

    drawBackground(){
        if("drawBackground" in this.scene.instance){
            this.scene.instance.drawBackground();
        }
    }
    drawPerspective(){
        if("drawPerspective" in this.scene.instance){
            this.scene.instance.drawPerspective();
        }
    }
    drawUI(){
        if("drawUI" in this.scene.instance){
            this.scene.instance.drawUI();
        }
    }
    timer(){
        if("timer" in this.scene.instance){
            this.scene.instance.timer();
        }
    }

    hammer(unit,kind,e,volume){
        if("hammer" in this.scene.instance){
            this.scene.instance.hammer(unit,kind,e,volume);
        }
    }

    websocket(receive){
        if("websocket" in this.scene.instance){
            this.scene.instance.websocket(receive);
        }
    }
}

module.exports = SceneManager;
