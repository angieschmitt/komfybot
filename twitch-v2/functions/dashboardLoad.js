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
						const events = resData.events;
						const reactwords = resData.reactwords;
						const redeems = resData.redeems;
						const overlays = resData.overlays;
						const settings = resData.settings;
						const store = resData.store;
						const timers = resData.timers;

						// Important ones first...
						parent.dashboardHandler('settings', settings, client, true);
						parent.dashboardHandler('addons', addons, client, true);
						parent.dashboardHandler('overlays', overlays, client, true);

						// Now the interactive ones...
						parent.dashboardHandler('events', events, client, true);
						parent.dashboardHandler('redeems', redeems, client, true);
						parent.dashboardHandler('store', store, client, true);
						parent.dashboardHandler('reactwords', reactwords, client, true);
						parent.dashboardHandler('timers', timers, client, true);

						// Commands are always last...
						parent.dashboardHandler('commands', commands, client, true);
					}
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				return client;
			});

	},
};