// https://twurple.js.org/reference/eventsub-base/classes/EventSubChannelRedemptionAddEvent.html

export default async function(event, client) {

    if (event.rewardId in client.redeems) {
        client.redeems[event.rewardId](event, client);
    }

};