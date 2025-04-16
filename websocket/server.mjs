import { WebSocketServer } from 'ws';

function init() {
    const wss = new WebSocketServer({ port: 8080 });

    let users = [];
    wss.on('connection', function connection(ws, req) {

        var userID = req.url.substr(1);
        if (!Object.values(users).includes(userID)) {
            users.push(userID);
        } else {
            const key = getKeyByValue(users, userID);
            users.splice(key, 1);
            users.push(userID);
        }

        ws.on('error', console.error);

        ws.on('message', function message(data) {
            console.log('Received: %s', data);

            console.log(users);
            let list = Array.from(wss.clients);

            let output = {
                'userList' : users
            };

            if ( isJson(data) ){

                const panel = getKeyByValue(users, 'panel');

                const parsed = JSON.parse(data);
                let target = getKeyByValue(users, parsed['action'].toString());

                if (parsed['action'] == 'refresh'){
                    target = panel;
                }

                // Loop over all the connections because we have to anyway...
                let iter = 0;
                wss.clients.forEach(function (client) {
                    if (iter == target){
                        output['response'] = parsed['action'];
                        client.send( JSON.stringify(output) );
                    }
                    iter++;
                });                
            }
            else {
                wss.clients.forEach(function (client) {
                    output['response'] = 'OOGA: ' + Math.random();
                    client.send( JSON.stringify(output) );
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