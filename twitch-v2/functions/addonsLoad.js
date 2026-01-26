const axios = require('axios');

module.exports = {
	async function(client, globals, userID, addonsJson, reset = false) {
		const parent = this;

		if (!('settings' in client)) {
			client.settings = [];
		}

		client.settings.addons = [];

		if (reset) {
			client.settings.addons = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		// If we have settings, handle them...
		if (Object.keys(addonsJson).length) {
			client.settings.addons = addonsJson;
		}
		// Otherwise, we get them...
		else {
			await axios.get(globals['endpoint'] + 'load/addons/' + userID)
				.then(function(response) {
					if (response.data.status == 'success') {
						const addons = response.data.response;
						const addonsJson = JSON.parse(addons, 'utf-8');

						client.settings.addons = addonsJson;

						parent.commandsLoad(client, globals, client.userID);
					}
				})
				.catch(err => console.log(err))
				.finally(() => {
					return client;
				});
		}

	},
};