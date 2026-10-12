export async function twitchLoader(client, type = false, reset = false){
    const parent = this;

    let twitchBadges = await parent.badgeLoader(client);
    // let twitchEmotes = await parent.emoteLoader(client);

    // console.log(twitchBadges.channel);
    
    client.badges = twitchBadges;
    // client.emotes = twitchEmotes;

    return client;    
}

export async function badgeLoader(client){
    const parent = this;

    let globalBadges = await client.apiClient.chat.getGlobalBadges(client.twitchUUID);
    let channelBadges = await client.apiClient.chat.getChannelBadges(client.twitchUUID);

    let globalBadgesOut = {};
    Object.entries(globalBadges).forEach(([idx, element]) => {
        globalBadgesOut[element.id] = {};
        Object.entries(element.versions).forEach(([idx2, version]) => {
            globalBadgesOut[element.id][version.id] = version.getImageUrl(4);
        });
    });

    let channelBadgesOut = {};
    Object.entries(channelBadges).forEach(([idx, element]) => {
        channelBadgesOut[element.id] = {};
        Object.entries(element.versions).forEach(([idx2, version]) => {
            channelBadgesOut[element.id][version.id] = version.getImageUrl(4);
        });
    });
    
    let badges = {};
    badges.global = globalBadgesOut;
    badges.channel = channelBadgesOut;

    return badges;
}

export async function emoteLoader(client, type = false, reset = false){
    const parent = this;

    let globalBadges = client.apiClient.chat.getChannelBadges();
    
}