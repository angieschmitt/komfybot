const axios = require('axios');

// Handle watching for refreshes...
const timerInterval = 5000;

module.exports = {
	async function(globals) {
		const parent = this;

		setInterval(
			function() {
				axios.get(globals['endpoint'] + 'refresh/refresh')
					.then(function(response) {
						if (response.data.status === 'success') {
							const refreshData = response.data.response;

							Object.entries(refreshData).forEach((data) => {
								const type = data[0];
								const users = data[1];
								Object.entries(users).forEach(([idx, userID]) => { // eslint-disable-line no-unused-vars

									if (userID in globals.bots) {
										if (type == 'addons') {
											parent.addonsLoad(globals.bots[userID], globals, userID, {}, true);
										}
										else if (type == 'commands') {
											parent.commandsLoad(globals.bots[userID], globals, userID, true);
										}
										else if (type == 'reactwords') {
											parent.reactwordsLoad(globals.bots[userID], globals, userID, true);
										}
										else if (type == 'settings') {
											parent.settingsLoad(globals.bots[userID], globals, userID, {}, true);
										}
										else if (type == 'timers') {
											parent.timersLoad(globals.bots[userID], globals, userID, true);
										}
									}

									// Pass back to remove the flag...
									axios.get(globals['endpoint'] + 'refresh/refresh/' + userID + '/' + type)
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