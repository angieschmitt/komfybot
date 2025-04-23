import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';

function init() {

    const server = createServer({
        cert: readFileSync('websocket/certs/server-cert.pem'),
        key: readFileSync('websocket/certs/server-key.pem')
    });
    const wss = new WebSocketServer({ server });

    let users = [];
    wss.on('connection', function connection(ws, req) {

        // get userID...
        var userID = req.url.substr(1);

        // add to users
        if (!Object.values(users).includes(userID)) {
            users.push(userID);
        } else {
            const key = getKeyByValue(users, userID);
            users.splice(key, 1);
            users.push(userID);
        }

        ws.on('error', console.error);

        ws.on('message', function message(data) {

            let output = {
                'userList' : users
            };

            if ( isJson(data) ){

                const parsed = JSON.parse(data);

                console.log(parsed);

                let action = parsed['action'].toString();
                let source = parsed['source'].toString();
                let target = 999;

                switch (action) {
                    case 'all':
                        break;
                    case 'close':
                        // remove closed connection
                        users.splice(getKeyByValue(users, source), 1);
                        output['userList'] = users;
                        target = getKeyByValue(users, 'panel');
                        action = 'refresh';
                        break;
                    case 'refresh':
                        target = getKeyByValue(users, 'panel');
                        break;
                    default:
                        target = getKeyByValue(users, action);
                        break;
                }

                output['response'] = action;
                if ('data' in parsed){
                    output['data'] = parsed['data'].toString()
                }

                output['timestamp'] = new Date().toISOString().slice(0, 19).replace('T', ' ');

                // Loop over all the connections because we have to anyway...
                let iter = 0;
                wss.clients.forEach(function (client) {
                    if (iter == target || target == 999){
                        client.send( JSON.stringify(output) );
                    }
                    iter++;
                });
            }
            else {

                console.log(data);

                wss.clients.forEach(function (client) {
                    output['response'] = 'OOGA: ' + Math.random();
                    client.send( JSON.stringify(output) );
                });
            }
        });

        ws.on('error', console.error);
    
        ws.on('message', function message(data) {
            console.log('received: %s', data);
        });
    
        ws.send('something');
    });

    server.listen(8080);
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