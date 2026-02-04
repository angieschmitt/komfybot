module.exports = {
	async function(timers, client, reset = false) {
		const parent = this;

		client.timers = [];

		if (reset) {
			client.timers = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		Object.entries(timers).forEach(([index, timer]) => { // eslint-disable-line no-unused-vars
			Object.entries(timer).forEach(([name, data]) => {
				client.timers[name] = [];
				client.timers[name]['timer'] = parseInt(data['timer']);
				client.timers[name]['message'] = data['message'];
			});
		});

		parent.timersHandler(client);

		return client;
	},
};