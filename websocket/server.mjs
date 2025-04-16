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
            // console.log('Received: %s', data);

            // console.log(users);
            let list = Array.from(wss.clients);

            let output = {
                'userList' : users
            };

            if ( isJson(data) ){

                const parsed = JSON.parse(data);

                let action = parsed['action'].toString();
                let source = parsed['source'].toString();
                let target = 999;

                output['userList'] = users;

                console.log(action);

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

                console.log(target);
                output['response'] = action;
                console.log(output);

                // Loop over all the connections because we have to anyway...
                let iter = 0;
                wss.clients.forEach(function (client) {
                    if (iter == target){
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