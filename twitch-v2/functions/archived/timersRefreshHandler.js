const axios = require('axios');

// Handle watching for refreshes...
const timerInterval = 5000;

module.exports = {
	async function(globals) {
		const parent = this;

		setInterval(
			function() {
				axios.get(globals['endpoint'] + 'timers/refresh')
					.then(function(response) {
						if (response.data.status === 'success') {
							const list = response.data.response;

							if (Object.keys(list).length) {
								Object.entries(list).forEach(([idx, userID]) => { // eslint-disable-line no-unused-vars
									if (userID in globals.bots) {
										parent.timersLoad(globals.bots[userID], globals, userID, true);
									}

									// Pass back to remove the flag...
									axios.get(globals['endpoint'] + 'timers/refresh/' + userID)
										.catch(err => console.log(err));
								});
							}
						}
					})
					.catch(err => console.log(err));
			},
			timerInterval,
		);
	},
};