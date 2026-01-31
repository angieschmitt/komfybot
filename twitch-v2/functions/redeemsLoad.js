const axios = require('axios');

module.exports = {
	async function(client, globals, userID, reset = false) {
		const parent = this;

		client.redeems = [];
		client.redeems.states = [];

		if (reset) {
			client.redeems = new Array();
			client.redeems.states = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		await axios.get(globals['endpoint'] + 'load/redeems/' + userID)
			.then(function(response) {
				if (response.data.status == 'success') {
					const redeems = response.data.response;
					Object.entries(redeems).forEach(([index, timer]) => { // eslint-disable-line no-unused-vars
						client.redeems[index] = parent.redeemsHandler(index);
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				return client;
			});

		// parent.timersHandler(client, globals);
	},
};