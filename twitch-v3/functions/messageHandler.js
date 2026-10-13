import axios from 'axios';
import { buildEmoteImageUrl } from '@twurple/chat'

export async function messageHandler(event, client) {
    const parent = this;

    // Log chatters...
    parent.dataChatters(event, client);

    // Setup the passive income watcher...
    let passive = true;

    // Get the perms...
    const perms = await parent.getUserPermissions(await event.getChatter(), client);

    // Check for a command...
    const command = await parent.commandLocator(event.messageText, client);
    if (command) {
        parent.commandHandler(command, perms, event, client);
        console.log(`${event.chatterName} used command: ${command.args}`);
        passive = false;
    }

    // client.redeems.states.chaosMode = true;

    // Chaos Mode stuff...
    if ('chaosMode' in client.redeems.states) {
        if (client.redeems.states.chaosMode) {
            const cleanedMessage = event.messageText.trim();
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
    const reactwordCheck = await parent.reactwordLocator(event, client);
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
                    parent.passiveHandler(perms, event, client);
                }
            }
        }
    }
}

export async function chatOverlayHandler(event, client) {

    // Pass to the chat overlay...
    let dataOut = {
        'chatterDisplayName' : event.chatterDisplayName,
        'chatterId' : event.chatterId,
        'chatterName' : event.chatterName,
        'color' : event.color,
        'messageId' : event.messageId,
        'messageText' : event.messageText,
        'messageType' : event.messageType,
        'messageParts' : event.messageParts,
        'badges' : {},
        'emotes' : {},
    };

    // Handle converting badges...
    Object.entries(event.badges).forEach(async ([key, value]) => {
        dataOut.badges[key] = {};
        
        // If we have more info, add it...
        let badgeInfo = event.getBadgeInfo(key);
        if (badgeInfo){
            dataOut.badges[key]['length'] = badgeInfo;
        }

        // Now locate the image that we need...
        if ( key in client.badges.channel ){
            if (value in client.badges.channel[key]){                
                dataOut.badges[key]['url'] = client.badges.channel[key][value];
            }
        }
        else if ( key in client.badges.global ){
            if (value in client.badges.global[key]){
                dataOut.badges[key]['url'] = client.badges.global[key][value];
            }
        }
    });

    // Handle emotes...
    Object.entries(event.messageParts).forEach(async ([key, part]) => {
        if (part.type === 'emote') {
            dataOut.emotes[part.text] = {};

            let settings = { 'animationSettings': 'static', 'backgroundType': 'light', 'size' : '3.0' };

            // Add the static emote url
            dataOut.emotes[part.text]['static'] = buildEmoteImageUrl(part.emote.id, settings);

            // If there is an animated version...
            if (part.emote.format.includes('animated')){
                settings.animationSettings = 'animated';
                dataOut.emotes[part.text]['animated'] = buildEmoteImageUrl(part.emote.id, settings);
            }
        }
    });

    client.websocket.send(JSON.stringify({ 'action': 'chat', 'data': { 'event' : dataOut, 'target': 'chat:' + client.userID, }, 'source': 'komfybot' }));
}

export async function passiveHandler(perms, event, client){

    // Get the viewerID,
    const viewerID = event.chatterId;

    // Figure out the income amout...
    let income = client.settings.passive.amts.default;
    if (perms.sub) {
        income = client.settings.passive.amts.subscribers;
    }

    // Now smash that endpoint...
    axios.get(client.endpoint + 'coins/passive/' + client.userID + '/' + viewerID + '/' + income)
        .catch(err => console.log(err));
}

export async function sayHandler(client, message, forSourceOnly = false) {
    const parent = this;

    if (forSourceOnly) {
        client.apiClient.chat.sendChatMessageAsApp(client.botUserID, client.twitchUUID, message, {'forSourceOnly': true}).catch((error) => {
            setTimeout(() => {
                client.chatClient.say(client.channel, message);
            }, 2500);
        });
    }
    else {
        client.chatClient.say(client.channel, message).catch(() => {
            setTimeout(() => {
                client.chatClient.say(client.channel, message);
            }, 2500);
        });
    }
};

export async function getUserPermissions(user, client){

    let modStatus = await client.apiClient.moderation.checkUserMod(client.twitchUUID, user.id);
    let subStatus = await client.apiClient.subscriptions.getSubscriptionForUser(client.twitchUUID, user.id);
    let vipStatus = await client.apiClient.channels.checkVipForUser(client.twitchUUID, user.id);

    // Set the defaults...
    const perms = {
        'admin' : (user.id == '90928645' ? true : false),
        'streamer' : (user.id == client.twitchUUID ? true : false),
        'mod' : modStatus,
        'vip' : vipStatus,
        'sub' : (subStatus !== null ? true : false),
    };

    // For some reason, streamers aren't mods on their own channel...
    if (user.id == client.twitchUUID) {
        perms.mod = true;
    }

    return perms;

};