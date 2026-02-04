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
										if (type == 'addons') {
											parent.dashboardLoad(globals.bots[userID], globals, 'addons', true);
											// parent.addonsLoad(globals.bots[userID], globals, userID, {}, true);
										}
										else if (type == 'command') {
											parent.dashboardLoad(globals.bots[userID], globals, 'commands', true);
											// parent.commandsLoad(globals.bots[userID], globals, userID, true);
										}
										else if (type == 'overlay') {
											parent.dashboardLoad(globals.bots[userID], globals, 'overlays', true);
											// parent.overlaysLoad(globals.bots[userID], globals, true);
										}
										else if (type == 'reactwords') {
											parent.dashboardLoad(globals.bots[userID], globals, 'reactwords', true);
											// parent.reactwordsLoad(globals.bots[userID], globals, userID, true);
										}
										else if (type == 'redeems') {
											parent.dashboardLoad(globals.bots[userID], globals, 'redeems', true);
											// parent.reactwordsLoad(globals.bots[userID], globals, userID, true);
										}
										else if (type == 'settings') {
											parent.dashboardLoad(globals.bots[userID], globals, 'settings', true);
											// parent.settingsLoad(globals.bots[userID], globals, userID, {}, true);
										}
										else if (type == 'timer') {
											parent.dashboardLoad(globals.bots[userID], globals, 'timers', true);
											// parent.timersLoad(globals.bots[userID], globals, userID, true);
										}
									}

									// Pass back to remove the flag...
									axios.get(globals['endpoint'] + 'load/refresh/' + userID + '/' + type)
										.catch(err => console.log(err));
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