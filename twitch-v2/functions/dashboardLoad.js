const axios = require('axios');

module.exports = {
	async function(client, type = false, reset = false) {
		const parent = this;

		await axios.get(client.endpoint + 'load/retrieve/' + client.userID)
			.then(function(response) {
				if (response.data.status == 'success') {
					const resData = response.data.response;

					// If we have a specific type, only refresh that data...
					if (type) {
						console.log('refreshing: ' + type);
						parent.dashboardHandler(type, resData[type], client, reset);
					}
					// Otherwise, refresh it all...
					else {
						// Setup the containers..
						const addons = resData.addons;
						const commands = resData.commands;
						const reactwords = resData.reactwords;
						const redeems = resData.redeems;
						const overlays = resData.overlays;
						const settings = resData.settings;
						const timers = resData.timers;

						// Important ones first...
						parent.dashboardHandler('settings', settings, client, reset);
						parent.dashboardHandler('addons', addons, client, reset);
						parent.dashboardHandler('overlays', overlays, client, reset);

						// Now the interactive ones...
						parent.dashboardHandler('redeems', redeems, client, reset);
						parent.dashboardHandler('reactwords', reactwords, client, reset);
						parent.dashboardHandler('timers', timers, client, reset);

						// Commands are always last...
						parent.dashboardHandler('commands', commands, client, reset);
					}
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				return client;
			});

	},
};