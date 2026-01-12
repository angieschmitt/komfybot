const axios = require('axios');

// Handle watching for refreshes...
const timerInterval = 10000;
// const timerInterval = 5000;

module.exports = {
	async function(globals) {
		const parent = this;

		setInterval(
			function() {
				axios.get(globals['endpoint'] + 'commands/refresh')
					.then(function(response) {
						if (response.data.status === 'success') {
							const list = response.data.response;

							if (Object.keys(list).length) {

								// eslint-disable-next-line no-unused-vars
								Object.entries(list).forEach(([idx, userID]) => {

									parent.loadCommands(globals.bots[userID], globals, userID, true);

									// Pass back to remove the flag...
									axios.get(globals['endpoint'] + 'commands/refresh/' + userID)
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