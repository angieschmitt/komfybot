import { WebSocketServer } from 'ws';

function init() {
    const wss = new WebSocketServer({ port: 8080 });

    let users = [];
    wss.on('connection', function connection(ws, req) {

        var userID = req.url.substr(1);
        if(!(userID in users)){
            users.push(userID);
        }

        console.log(users);

        ws.on('error', console.error);

        ws.on('message', function message(data) {
            console.log('Received: %s', data);

            if ( isJson(data) ){
                let parsed = JSON.parse(data);

                let target = getKeyByValue(users, parsed['ping'].toString());

                let iter = 0;
                wss.clients.forEach(function (client) {
                    if (iter == target){
                        client.send( parsed['ping'] + ' => ' + Math.random() );
                    }
                    iter++;
                });

                
            }
            else {
                wss.clients.forEach(function (client) {
                    client.send( 'OOGA: ' + Math.random() );
                });
            }
        });
    });
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

init();