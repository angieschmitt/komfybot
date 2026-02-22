const axios = require('axios');

module.exports = {
	async function(dataType, client) {

		// If the data bucket doesn't exist...
		if (!('data' in client)) {
			client.data = [];
			client.data.chatters = [];
			client.data.walkOn = {};
		}

		client.data.walkOn = {
			1 : {
				547517825 : 'whos-that-pokemon',
				90928645 : 'cute-and-fluffy',
			},
			2 : {
				547517825 : 'whos-that-pokemon',
				90928645 : 'cute-and-fluffy',
			},
		};

		if (dataType == 'chatters') {
			axios.get(client.endpoint + 'data/chatters/' + client.userID + '/all')
				.then(function(response) {
					if (response.data.status === 'success') {
						client.data.chatters = response.data.response;
					}
				})
				.catch(err => console.log(err));
		}
		if (dataType == 'chaos-mode') {
			if ('chaos-mode' in client.overlay) {
				client.data.chaosMode = {};
				Object.entries(client.overlay['chaos-mode'].data).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
					const triggers = data.trigger.split(',');
					triggers.forEach((idx2) => {
						client.data.chaosMode[idx2.toString()] = data.mediaID;
					});
				});
			}
		}
	},
};