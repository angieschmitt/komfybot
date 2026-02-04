const axios = require('axios');

module.exports = {
	async function(client, globals, userID, reset = false) {
		// const parent = this;

		if (!('overlay' in client)) {
			client.overlay = [];
		}

		if (reset) {
			client.overlay = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		// Otherwise, we get them...
		await axios.get(globals['endpoint'] + 'load/overlays/' + client.userID)
			.then(function(response) {
				if (response.data.status == 'success') {
					const overlays = response.data.response;

					Object.entries(overlays).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
						const overlayContent = JSON.parse(item['content']);
						client.overlay[item['name'].toLowerCase()] = [];
						if ('data' in overlayContent) {
							client.overlay[item['name'].toLowerCase()]['data'] = overlayContent['data'];
						}
						if ('settings' in overlayContent) {
							client.overlay[item['name'].toLowerCase()]['settings'] = overlayContent['settings'];
						}
					});

				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				return client;
			});
	},
};