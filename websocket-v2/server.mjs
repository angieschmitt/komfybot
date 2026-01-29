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
        cert: readFileSync( path.resolve(__dirname, './certs/server-cert.pem') ),
        key: readFileSync( path.resolve(__dirname, './certs/server-key.pem') )
    });

    const wss = new WebSocketServer({ server });

    let users = {};
    let groups = {};
    wss.on('connection', function connection(ws, req) {

        console.log('connect');
        
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