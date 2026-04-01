import axios from 'axios';

export async function dataChatters(msg, channel, client) {
    const viewerID = parseInt(msg.userInfo.userId);
    if (!client.data.chatters.includes(viewerID)) {
        
        // Check for walk-on...
        if ('walk-ons' in client.overlay){
            const walkonsData = client.overlay['walk-ons'].data;
            const walkonData = walkonsData.find((developer) => developer.twitchUUID === tags['user-id']);

            if (walkonData){
                client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'content' : walkonData.mediaID, 'type' : 'walkOn', 'target': 'walk-ons:' + client.userID }, 'source': 'komfybot' }));
            }
        }

        client.data.chatters.push(viewerID);
        await axios.get(client.endpoint + 'data/chatters/' + client.userID + '/' + viewerID)
            .catch(err => console.log(err));
    }
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