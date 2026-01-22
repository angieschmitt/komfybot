const axios = require('axios');

module.exports = {
	async function(client, channel, tags) {
		const viewerID = parseInt(tags['user-id']);
		if (!client.data.chatters.includes(viewerID)) {
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