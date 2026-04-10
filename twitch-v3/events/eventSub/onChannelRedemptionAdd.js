// https://twurple.js.org/reference/eventsub-base/classes/EventSubChannelRedemptionAddEvent.html

export default async function(event, client) {

    if (event.rewardId in client.redeems) {
        if ('default' in client.redeems[event.rewardId]){
           client.redeems[event.rewardId].default(event, client); 
        }
        else {
            client.redeems[event.rewardId].input(event, client); 
        }
    }

};