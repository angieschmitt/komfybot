module.exports = {
	async function(overlays, client, reset = false) {
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

		return client;
	},
};