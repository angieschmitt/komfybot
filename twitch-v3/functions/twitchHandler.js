export async function twitchLoader(client, type = false, reset = false){
    const parent = this;

    let twitchBadges = await parent.badgeLoader(client);
    let twitchCheers = await parent.cheerLoader(client);
    
    client.badges = twitchBadges;
    client.cheers = twitchCheers;

    return client;    
}

export async function badgeLoader(client){
    const parent = this;

    // Define the buckets...
    let badges = {};
    badges.global = {};
    badges.channel = {};

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
    
    // Now set them for output...
    badges.global = globalBadgesOut;
    badges.channel = channelBadgesOut;

    return badges;
}

export async function cheerLoader(client){
    const parent = this;

    // Define the buckets...
    let cheers = {};
    cheers.global = {};
    cheers.channel = {};

    let globalCheers = await client.apiClient.bits.getCheermotes();
    let channelCheers = await client.apiClient.bits.getCheermotes(client.twitchUUID);

    cheers.global = {
        'cheers' : globalCheers,
        'names' : globalCheers.getPossibleNames()
    }
    cheers.channel = {
        'cheers' : channelCheers,
        'names' : channelCheers.getPossibleNames()
    }

    return cheers;
}