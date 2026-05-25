// https://twurple.js.org/reference/eventsub-base/classes/EventSubStreamOfflineEvent.html

import axios from 'axios';

export default async function(event, client) {

    console.log(`Channel ${event.broadcasterDisplayName} is now OFFLINE.`);

    // If they have custom text for streamOffline, send it now...
    if ('notifications' in client.settings) {
        if ('streamOffline' in client.settings.notifications) {
            if (client.settings.notifications.streamOffline !== '') {
                parent.sayHandler(client, client.settings.notifications.streamOffline);
            }
        }
    }

    // If this message is about the user...
    if (event.broadcasterId == client.twitchUUID) {
        // Once we get the offline ping, wait 5 mins to mark offline...
        client.timeouts.clear('offlineTimer');
        client.timeouts.make(
            'offlineTimer',
            () => {
                console.log(`Channel ${event.broadcasterDisplayName} is now OFFICIALLY offline.`);
                axios.get(client.endpoint + 'live/update/' + client.userID);
                client.isLive = false;
            },
            300000,
        );
    }

};