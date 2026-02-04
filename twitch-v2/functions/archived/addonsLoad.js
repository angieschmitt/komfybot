// const axios = require('axios');

module.exports = {
	async function(addons, client, reset = false) {
		// const parent = this;

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

		const addonsJson = JSON.parse(addons, 'utf-8');
		client.settings.addons = addonsJson;

		return client;

	},
};