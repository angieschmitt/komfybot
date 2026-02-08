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
								Object.entries(users).forEach(([idx, userID]) => { // eslint-disable-line no-unused-vars

									if (userID in globals.bots) {

										const client = globals.bots[userID];

										if (type == 'addons') {
											parent.dashboardLoad(client, 'addons', true);
										}
										else if (type == 'command') {
											parent.dashboardLoad(client, 'commands', true);
										}
										else if (type == 'overlay') {
											parent.dashboardLoad(client, 'overlays', true);
										}
										else if (type == 'reactwords') {
											parent.dashboardLoad(client, 'reactwords', true);
										}
										else if (type == 'redeems') {
											parent.dashboardLoad(client, 'redeems', true);
										}
										else if (type == 'settings') {
											parent.dashboardLoad(client, 'settings', true);
										}
										else if (type == 'timer') {
											parent.dashboardLoad(client, 'timers', true);
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