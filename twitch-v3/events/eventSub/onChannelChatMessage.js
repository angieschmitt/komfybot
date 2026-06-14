// https://twurple.js.org/reference/eventsub-base/classes/EventSubChannelChatMessageEvent.html

import e from 'express';
import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export function settings(client) {
    return [
        client.twitchUUID,
        client.botUserID
    ];
}

export async function action(event, client) {

    // Assume we're handling the message...
    let handleMessage = true;

    // If this is the bot, ignore...
    if (event.chatterId == client.botUserID){
        handleMessage = false;
    }

    // If we are in a shared chat...
    if (event.sourceBroadcasterId !== null) {
        // And it doesn't match our channels id....
        if(event.sourceBroadcasterId !== client.twitchUUID){
            handleMessage = false;
        }
    }

    // If we're still handling the message...
    if (handleMessage){
        client.lastMessage = event.messageText;
        functions.messageHandler(event, client);
    }

};