const axios = require('axios');

// Handle watching for refreshes...
const timerInterval = 5000;

module.exports = {
	async function(globals) {
		const parent = this;

		setInterval(
			() => {
				axios.get(globals['endpoint'] + 'load/refresh')
					.then(function(response) {
						if (response.data.status === 'success') {
							const refreshData = response.data.response;

							Object.entries(refreshData).forEach((data) => {
								const type = data[0].toLowerCase();
								const users = data[1];
								Object.entries(users).forEach(async ([idx, userID]) => { // eslint-disable-line no-unused-vars

									if (userID in globals.bots) {

										const client = globals.bots[userID];

										// Handle the refresh
										await parent.dashboardLoad(client, type, true);

										// Special cleanups...
										if (type == 'overlays') {
											await parent.dataLoad('chaos-mode', client);
										}

										// Pass back to remove the flag...
										axios.get(client.endpoint + 'load/refresh/' + userID + '/' + type)
											.catch(err => console.log(err));
									}

								});
							});
						}
					})
					.catch();
			},
			timerInterval,
		);
	},
};