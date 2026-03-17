import axios from 'axios';

export async function dataChatters(msg, channel, client) {
    const viewerID = parseInt(msg.userInfo.userId);
    if (!client.data.chatters.includes(viewerID)) {
        if (viewerID in client.data.walkons) {
            const walkon = client.data.walkons[viewerID];
            if (walkon) {
                client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'content' : walkon, 'type' : 'walkOn', 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));
            }
        }

        client.data.chatters.push(viewerID);
        await axios.get(client.endpoint + 'data/chatters/' + client.userID + '/' + viewerID)
            .catch(err => console.log(err));
    }
}

export async function dataChaosWords(client) {
    const parent = this;

    if ('chaos-mode' in client.overlay) {
        client.data.chaosMode = {};
        Object.entries(client.overlay['chaos-mode'].data).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
            const triggers = data.trigger.split(',');
            triggers.forEach((idx2) => {
                client.data.chaosMode[idx2.toString()] = data.mediaID;
            });
        });
    }

    return client;
}

export async function dataLive(client) {
    axios.get(client.endpoint + 'live/update/' + client.userID + '/force')
        .then(function(response) {
            const responseData = response.data;
            if (responseData.status === 'success') {
                const userData = responseData.response;
                client['isLive'] = (userData.isLive === '0' ? false : true);
                client['streamData'] = userData.streamData;

                if (Object.keys(client.streamData).length > 0) {
                    const dateLive = new Date(userData.streamData.started_at);
                    const dateNow = new Date();
                    const minsLive = Math.floor(Math.floor((dateNow - (dateLive)) / 1000) / 60);

                    // Set the timerOffset
                    client.timerOffset = minsLive;
                }
            }
        })
        .catch(err => console.log(err));
};