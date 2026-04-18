import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, user, text, msg

export default async function(channel, user, text, msg, client) {

    // Assume we're handling the message...
    let handleMessage = true;

    // If we have a source-room-id...
    if (msg.tags.get('source-room-id')) {
        // And it doesn't match our channels id....
        if(msg.tags.get('source-room-id') !== client.twitchUUID){
            handleMessage = false;
        }
    }

    if (handleMessage){
        client.lastMessage = text;
        functions.messageHandler(channel, user, text, msg, client);
    }

};