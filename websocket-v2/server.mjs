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
        cert: readFileSync('./certs/server-cert.pem'),
        key: readFileSync('./certs/server-key.pem')
    });

    const wss = new WebSocketServer({ server });

    let users = {};
    let groups = {};
    wss.on('connection', function connection(ws, req) {

        // get userID...
        var userID = req.url.substr(1);

        users = handleUsers(userID, users);
        groups = handleGroups(userID, groups);

        ws.on('error', function message(error){
            console.log(error);
        });

        ws.on('message', function message(data, isBinary) {
            
            const message = isBinary ? data : data.toString();
            if ( isJson(message) ){

                const parsed = JSON.parse(message);

                let data = false;
                let action = parsed['action'].toString();
                let source = parsed['source'].toString();
                if ( 'data' in parsed) {
                    data = parsed['data'];
                }

                // Prep output...
                let output = {
                    'userList' : users,
                    'groupList' : groups,
                    'timestamp' : new Date().toISOString().slice(0, 19).replace('T', ' ')
                };

                // Handle the action
                if ( action in actions ){
                    output['action'] = action;
                    let actionOutput = actions[action].execute(users, groups, source, data);
                    Object.entries(actionOutput).forEach(([key, value]) => {
                        output[ key ] = value;
                    });
                }

                // Handle live-check
                if ( action == 'live-check' ) {
                    users[ source ] = data['timestamp'];

                    // Clean out things that haven't checked in...
                    users = cleanUsers(users);
                    groups = cleanGroups(users, groups);

                    // Overwrite the data..
                    output.userList = users;
                    output.groupList = groups;
                    output.action = 'refresh';
                    output.target = 'all';
                    output.source = 'server';
                }

                // Handle "all" pings...
                if ( output.target == 'all' ){
                    wss.clients.forEach(function (client) {
                        client.send( JSON.stringify(output) );
                    });
                } else if ( typeof output.target === 'object' ){
                    let iter = 0;
                    wss.clients.forEach(function (client) {
                        if (Object.values(output.target).indexOf(iter.toString()) > -1) {
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

    server.listen(9090);
}

function handleUsers(userID, users){

    // If not in list, add it and set timestamp...
    if (!(userID in users)){
        users[ userID ] = new Date().toISOString();
    }
    
    return users;
}

function handleGroups(userID, groups){

    // Check if we have a group...
    var uniqueCheck = userID.split(':')

    // // Add to a group if we need to...
    if ( uniqueCheck !== null && Object.keys(uniqueCheck).length > 1 ) {
        // If the group isn't set, add it...
        if (!Object.keys(groups).includes(uniqueCheck[0])) {
            groups[ uniqueCheck[0] ] = new Date().toISOString();
        }
    }
    
    return groups;
}

function cleanUsers(users){
    
    const dateNow = new Date();

    Object.entries(users).forEach(([user, timeStamp]) => {
        const lastCheckin = new Date( timeStamp );
        const diff = Math.ceil((dateNow - lastCheckin) / 1000);

        if ( diff > 30 ){
            delete users[user];
        }
    });

    return users;
}

function cleanGroups(users, groups){

    // Check if we have any users that match the group..
    Object.entries(groups).forEach(([group, timeStamp]) => {
        let count = 0;
        Object.entries(users).forEach(([user, timeStamp]) => {
            var uniqueCheck = user.split(':');
            if (uniqueCheck[0] == group){
                count++;
            }
        });

        if (count == 0) {
            delete groups[group];
        }

    });

    return groups;

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