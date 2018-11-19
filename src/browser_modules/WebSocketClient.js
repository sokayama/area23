// WebSocketClient
// シングルトン運用

class WebSocketClient {
    constructor(){
        this.hostname = null;
        this.connection = null;
    }

    connectServer(hostname,socketPort,openFunc){
        if(hostname.match(":")){
            let host = hostname.split(":");
            this.hostname = host[0];
        }else{
            this.hostname = hostname;
        }
        this.hostname = "ws://" + this.hostname + ":" + socketPort;
        console.log("[WebSocketClient] we try connecting...; hostname:",this.hostname);
        this.connection = new WebSocket(this.hostname);
        if(this.connection !== null) {
            if(openFunc){
                this.connection.onopen = openFunc;
            }else{
                this.connection.onopen = (event)=> {
                    console.log("[WebSocketClient] onopen:",event);
                };
            }
        }
    }
    receive(callback){
        if(this.connection !== null) {
            this.connection.onmessage = (event)=> {
                // 受信したメッセージ
                let receiveData = JSON.parse(event.data);
                callback(receiveData);
            };
        }
    }
    reConnect(){
        console.log("[WebSocketClient] reconnect")
        if(this.connection.readyState == 2 || this.connection.readyState == 3){//closing || closed
            ConnectServer();
        }
    }
    send(data){
        if(this.connection === null){
            console.log("[WebSocketClient] connection null")
            this.reConnect();
        }
        if(this.connection.readyState === 0){
            console.log("[WebSocketClient] readyState CONNECTING")
        }
        else if(this.connection.readyState === 1){
            // console.log("send :",data);
            if(data.type){ // 画像を送る
                if(data.type.search("image/") !== -1){
                    this.connection.send(data);
                }
            }else{ // JSONを送る
                this.connection.send(JSON.stringify(data));
            }
        }
        else if(this.connection.readyState === 2){
            console.log("[WebSocketClient] readyState CLOSING")
        }
        else if(this.connection.readyState === 3){
            console.log("[WebSocketClient] readyState CLOSED")
        }
    }
}

module.exports = WebSocketClient;
