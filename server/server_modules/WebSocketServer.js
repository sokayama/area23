(()=>{
    /* npm install websocket */

    'use strict'
    class WebSocketServer {
        constructor(){
            this.ws = require('websocket').server;
            this.wsServer = null;
            this.http = require('http');

            this.clients = [];
            this.PORT = 8080;
        }

        listen(port,callback){
            if(port){
                this.PORT = port;
            }
            let httpServer = this.http.createServer(()=>{
            }).listen(this.PORT);

            this.wsServer = new this.ws({
                httpServer: httpServer,
                maxReceivedFrameSize: 0x1000000000
            });
            console.log("WebSocket Listening on "+this.PORT);
            
            this.wsServer.on('request', (req)=> {
                req.origin = req.origin || '*';
            
                let req_client = req.accept(null, req.origin);
                this.clients.push(req_client);
            
                req_client.on('message', (msg)=> {
                    //console.log("mmmmmmmmmmmmmmsg",msg)
                    // console.log("[" + req.origin + "]:" + msg.utf8Data);
                    callback(msg,req_client);
                });
            
                req_client.on('close', (code,desc)=> {
                    console.log('connection released! :' + code + ' - ' + desc);
                    for(let i in this.clients){
                        if(req_client === this.clients[i]){
                            console.log("RELEASE",this.clients[i].remoteAddress);
                            this.clients.splice(i,1)
                        }
                    }
                });
            });
        }

        broadcast(data){
            let json = JSON.stringify(data);
            this.wsServer.broadcast(json);
        }

        getClients(){
            return this.clients;
        }
    }

    module.exports = WebSocketServer;
})();
