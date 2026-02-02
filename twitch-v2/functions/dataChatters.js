const axios = require('axios');

module.exports = {
	async function(client, channel, tags) {
		const viewerID = parseInt(tags['user-id']);
		if (!client.data.chatters.includes(viewerID)) {

			if (client.userID in client.data.walkOn) {
				const walkOn = (client.data.walkOn[client.userID][viewerID] ? client.data.walkOn[client.userID][viewerID] : false);
				if (walkOn) {
					client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'content' : walkOn, 'type' : 'walkOn', 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));
				}
			}

			await axios.get(client.endpoint + 'data/chatters/' + client.userID + '/' + viewerID)
				.then(function(response) {
					if (response.data.status == 'success') {
						const chatters = response.data.response;
						client.data.chatters = chatters;
					}
				})
				.catch(err => console.log(err))
				.finally(() => {
					return client;
				});
		}
	},
};