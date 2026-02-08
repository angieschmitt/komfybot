const axios = require('axios');

module.exports = {
	async function(dataType, client) {

		// If the data bucket doesn't exist...
		if (!('data' in client)) {
			client.data = [];
		}

		client.data.chatters = [];

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
		client.data.chaosWords = ['angie', 'antidisestablishmentarianism', 'butt', 'chicken', 'halloween', 'kiwi', 'lizard', '🦎', 'snail', 'supercalifragilisticexpialidocious', 'tittle', 'v', 'whale'];

		if (dataType == 'chatters') {
			axios.get(client.endpoint + 'data/chatters/' + client.userID + '/all')
				.then(function(response) {
					if (response.data.status === 'success') {
						client.data.chatters = response.data.response;
					}
				})
				.catch(err => console.log(err));
		}
	},
};