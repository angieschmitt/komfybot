// https://twurple.js.org/reference/eventsub-base/classes/EventSubChannelRedemptionAddEvent.html

export function settings(client) {
    return [
        client.twitchUUID,
    ];
}

export async function action(event, client) {

    if (event.rewardId in client.redeems) {
        if ('default' in client.redeems[event.rewardId]){
           client.redeems[event.rewardId].default(event, client); 
        }
        else {
            client.redeems[event.rewardId].input(event, client); 
        }
    }

};