module.exports = {
	async function(reactwords, client, reset = false) {

		client.reactwords = {};

		if (reset) {
			client.reactwords = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		Object.entries(reactwords).forEach(([uuid, reactWords]) => { // eslint-disable-line no-unused-vars
			client.reactwords[uuid] = {};
			Object.entries(reactWords).forEach(([word, response]) => {
				client.reactwords[uuid][ word ] = response;
			});
		});

		return client;

	},
};