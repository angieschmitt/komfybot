const axios = require('axios');

module.exports = {
	async function(dataType, client, globals) {

		// If the data bucket doesn't exist...
		if (!('data' in client)) {
			client.data = [];
		}

		if (dataType == 'chatters') {
			axios.get(globals['endpoint'] + 'data/chatters/' + client.userID + '/all')
				.then(function(response) {
					if (response.data.status === 'success') {
						client.data.chatters = response.data.response;
					}
				})
				.catch(err => console.log(err));
		}
	},
};