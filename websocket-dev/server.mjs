import { createServer } from 'https';
import { readdirSync, readFileSync } from 'fs';
import { WebSocketServer } from 'ws';

import * as path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const actions = loadActions();

function init() {

    const server = createServer({
        cert: readFileSync('../websocket-dev/certs/localhost.crt'),
        key: readFileSync('../websocket-dev/certs/localhost.key')
    });

    const wss = new WebSocketServer({ server });

    let users = [];
    let groups = [];
    wss.on('connection', function connection(ws, req) {

        // console.log(actions);

        // get userID...
        var userID = req.url.substr(1);

        // Check if we have a group...
        var uniqueCheck = userID.split(':')
        if ( uniqueCheck !== null && Object.keys(uniqueCheck).length > 1 ) {

            // If the group isn't set, add it...
            if (!Object.values(groups).includes(uniqueCheck[0])) {
                // Add the group
                groups.push(uniqueCheck[0]);
            }
            
        }
        
        // Add the userid
        if (!Object.values(users).includes(userID)) {
            users.push(userID);
        } else {
            const key = getKeyByValue(users, userID);
            users.splice(key, 1);
            users.push(userID);
        }

        ws.on('error', console.error);

        ws.on('message', function message(data, isBinary) {
            
            let output = {
                'userList' : users,
                'groupList' : groups,
            };

            const message = isBinary ? data : data.toString();
            if ( isJson(message) ){

                const parsed = JSON.parse(message);

                // console.log(parsed);

                let action = parsed['action'].toString();
                let source = parsed['source'].toString();
                
                let data = false;
                if ( 'data' in parsed){
                    data = parsed['data'];
                }

                // Handle the action
                if ( action in actions ){
                    output['action'] = action;
                    let actionOutput = actions[action].execute(users, groups, source, data);
                    Object.entries(actionOutput).forEach(([key, value]) => {
                        output[ key ] = value;
                    });
                }

                output['timestamp'] = new Date().toISOString().slice(0, 19).replace('T', ' ');

                // Handle "all" pings...
                if ( output.target == 'all' ){
                    wss.clients.forEach(function (client) {
                        client.send( JSON.stringify(output) );
                    });
                } else if ( typeof output.target === 'object' ){
                    let iter = 0;
                    wss.clients.forEach(function (client) {
                        if (Object.values(output.target).indexOf(iter.toString()) > -1) {

                            // console.log( 'action: ' + output.action );
                            // console.log( 'target: ' + output.target );

                            client.send( JSON.stringify(output) );
                        }
                        iter++;
                    });
                }
            }
            else {
                wss.clients.forEach(function (client) {
                    output['response'] = 'OOGA: ' + Math.random();
                    client.send( JSON.stringify(output) );
                });
            }

            // console.log( '- - -' );

        });
    });

    server.listen(1165);
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

function loadActions(actions = {}, reset = false){
    if (reset) {
        // Object.entries(actions).forEach(([channel]) => {
        //     client.commands[channel] = [];
        //     // Wipe out exisiting commands, and cache of them
        //     client.commands[channel] = new Array();
        // });
        // for (const i in require.cache) {
        //     delete require.cache[i];
        // }
    }

    // Assign actions
    const foldersPath = path.join(__dirname, './actions');
    const actionsFiles = readdirSync(foldersPath);

    for ( const file of actionsFiles) {
        const filePath = path.join(foldersPath, file);

        // This might be an issue later..
        const command = import( 'file:///' + filePath)
            .then(function(action) {
                actions[ action.default.name ] = action.default.actions.default;
            });
    }

    return actions;
}

init();