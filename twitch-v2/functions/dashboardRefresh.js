const axios = require('axios');

// Handle watching for refreshes...
const timerInterval = 5000;

module.exports = {
	async function(globals) {
		const parent = this;

		setInterval(
			function() {
				axios.get(globals['endpoint'] + 'load/refresh')
					.then(function(response) {
						if (response.data.status === 'success') {
							const refreshData = response.data.response;

							Object.entries(refreshData).forEach((data) => {
								const type = data[0];
								const users = data[1];
								Object.entries(users).forEach(async ([idx, userID]) => { // eslint-disable-line no-unused-vars

									if (userID in globals.bots) {

										const client = globals.bots[userID];

										if (type == 'addons') {
											await parent.dashboardLoad(client, 'addons', true);
										}
										else if (type == 'command') {
											await parent.dashboardLoad(client, 'commands', true);
										}
										else if (type == 'events') {
											await parent.dashboardLoad(client, 'events', true);
										}
										else if (type == 'overlay') {
											await parent.dashboardLoad(client, 'overlays', true);
											parent.dataLoad('chaos-mode', client);
										}
										else if (type == 'reactwords') {
											await parent.dashboardLoad(client, 'reactwords', true);
										}
										else if (type == 'redeems') {
											await parent.dashboardLoad(client, 'redeems', true);
										}
										else if (type == 'settings') {
											await parent.dashboardLoad(client, 'settings', true);
										}
										else if (type == 'timer') {
											await parent.dashboardLoad(client, 'timers', true);
										}

										// Pass back to remove the flag...
										axios.get(client.endpoint + 'load/refresh/' + userID + '/' + type)
											.catch(err => console.log(err));
									}

								});
							});
						}
					})
					.catch(err => console.log(err));
			},
			timerInterval,
		);
	},
};