import axios from 'axios';

export async function messageHandler(channel, user, text, msg, client) {
    const parent = this;

    // Log chatters...
    parent.dataChatters(msg, channel, client);

    // Setup the passive income watcher...
    let passive = true;
    
    // Get the perms...
    let perms = parent.getUserPermissions(msg);

    // Check for a command...
    const command = await parent.commandLocator(text, client);
    if (command) {
        parent.commandHandler(command, perms, channel, user, text, msg, client);
        console.log('Used command: ' + command.settings.name + ' ' + (command.args[1] ? command.args[1] : ''));
        passive = false;
    }

    // client.redeems.states.chaosMode = true;

    // Chaos Mode stuff...
    if ('chaosMode' in client.redeems.states) {
        if (client.redeems.states.chaosMode) {
            const cleanedMessage = text.trim();
            // If a single word...
            if (!cleanedMessage.includes(' ')) {
                // If it's in the channels chaos words...
                if (cleanedMessage.toLowerCase() in client.overlay['chaos-mode'].triggers) {
                    // Pass it off to the websocket...
                    client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'content' : client.overlay['chaos-mode'].triggers[cleanedMessage.toLowerCase()], 'type' : 'chat', 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));

                    // Chaos-mode doesn't give passive...
                    passive = false;
                }
            }
        }
    }

    // Handle reactwords...
    const reactwordCheck = await parent.reactwordLocator(text, msg, client);
    if (reactwordCheck) {
        const chosen = parent.randomObjValue(reactwordCheck);

        // If chaosMode exists...
        if ('chaosMode' in client.redeems.states) {

            // And we're NOT in chaosMode
            if (!client.redeems.states.chaosMode) {
                parent.sayHandler(client, chosen);
            }
        }
        // If chaosMode doesn't exist...
        else {
            parent.sayHandler(client, chosen);
        }
    }

    // Handle passive income...
    if (client.settings.currency.enabled) {
        if (client.settings.passive.enabled) {
            if (client.isLive) {
                if (passive) {
                    parent.passiveHandler(msg, perms, client);
                }
            }
        }
    }
}

export async function passiveHandler(msg, perms, client){

    // Get the viewerID,
    const viewerID = msg.userInfo.userId;

    // Figure out the income amout...
    let income = client.settings.passive.amts.default;
    if (perms.sub) {
        income = client.settings.passive.amts.subscribers;
    }

    // Now smash that endpoint...
    axios.get(client.endpoint + 'coins/passive/' + client.userID + '/' + viewerID + '/' + income)
        .catch(err => console.log(err));
}

export async function sayHandler(client, message) {
    const parent = this;

    client.chatClient.say(client.channel, message).catch(() => {
        setTimeout(() => {
            client.chatClient.say(client.channel, message);
        }, 2500);
    });
};

export function getUserPermissions(msg){

    // Set the defaults...
    const perms = {
        'admin' : (msg.userInfo.userId == '90928645' ? true : false),
        'streamer' : msg.userInfo.isBroadcaster,
        'mod' : msg.userInfo.isMod,
        'vip' : msg.userInfo.isVip,
        'sub' : msg.userInfo.isSubscriber,
    };

    // For some reason, streamers aren't mods on their own channel...
    if (msg.userInfo.isBroadcaster) {
        perms.mod = true;
    }

    return perms;

};