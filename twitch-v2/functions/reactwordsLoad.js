const axios = require('axios');

module.exports = {
	async function(client, globals, userID, reset = false) {

		client.reactwords = {};

		if (reset) {
			client.reactwords = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		await axios.get(globals['endpoint'] + 'reactwords/retrieve/' + userID)
			.then(function(response) {
				if (response.data.status == 'success') {
					const timers = response.data.response;
					Object.entries(timers).forEach(([uuid, reactWords]) => { // eslint-disable-line no-unused-vars
						client.reactwords[uuid] = {};
						Object.entries(reactWords).forEach(([word, response]) => {
							client.reactwords[uuid][ word ] = response;
						});
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				return client;
			});
	},
};