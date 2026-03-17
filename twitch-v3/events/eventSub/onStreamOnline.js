// https://twurple.js.org/reference/eventsub-base/classes/EventSubStreamOnlineEvent.html

import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export default async function(event, client) {

    console.log(`Channel ${event.broadcasterDisplayName} is now ONLINE.`);
    
    // If this message is about the user...
    if (event.broadcasterId == client.twitchUUID) {

        // If online comes in, clear offline timer...
        client.timeouts.clear('offlineTimer');

        // Locally mark the user as live...
        client.isLive = true;
        parent.sayHandler(client, 'Live Check: ' + client.isLive);

        // Force the DB to update...
        axios.get(client.endpoint + 'live/update/' + client.userID + '/force')
            .then(function(response) {
                const responseData = response.data;
                if (responseData.status === 'success') {
                    const userData = responseData.response;
                    client.streamData = userData.streamData;

                    // If there is streamData, get the offset...
                    if (Object.keys(client.streamData).length > 0) {
                        const dateLive = new Date(userData.streamData.started_at);
                        const dateNow = new Date();
                        const minsLive = Math.floor(Math.floor((dateNow - (dateLive)) / 1000) / 60);

                        // Set the timerOffset
                        client.timerOffset = minsLive;
                    }
                    // If not, we set it to 0 because they just went live...
                    // NOTE: THIS CAN HAVE FUTURE ISSUES
                    else {
                        // Set the timerOffset
                        client.timerOffset = 1;
                    }

                    functions.timerHandler(client, true);
                }
            })
            .catch((err) => {
                client.debug.write(client.channel, 'USER_ONLINE', err.message);
            });
    }

};