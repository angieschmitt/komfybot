const axios = require('axios');

module.exports = {
	async function(client, globals, userID, reset = false) {
		const parent = this;

		client.timers = [];

		if (reset) {
			client.timers = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		await axios.get(globals['endpoint'] + 'timers/retrieve/' + userID)
			.then(function(response) {
				if (response.data.status == 'success') {
					const timers = response.data.response;
					Object.entries(timers).forEach(([index, timer]) => { // eslint-disable-line no-unused-vars
						Object.entries(timer).forEach(([name, data]) => {
							client.timers[name] = [];
							client.timers[name]['timer'] = parseInt(data['timer']);
							client.timers[name]['message'] = data['message'];
						});
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				return client;
			});

		parent.timersHandler(client, globals);
	},
};