const axios = require('axios');

// Handle watching for refreshes...
const timerInterval = 2500;

module.exports = {
	async function(globals) {
		// const parent = this;

		setInterval(
			function() {
				axios.get(globals['endpoint'] + 'redeems/update/')
					.then(function(response) {
						if (response.data.status === 'success') {
							const list = response.data.response;
							if (Object.keys(list).length) {
								Object.entries(list).forEach(([userID, redemptionData]) => { // eslint-disable-line no-unused-vars
									if (userID in globals.bots) {
										Object.entries(redemptionData).forEach(([redemptionID, redemptions]) => { // eslint-disable-line no-unused-vars
											Object.entries(redemptions).forEach(([idx, redeemData]) => { // eslint-disable-line no-unused-vars
												globals.bots[userID].redeems[redemptionID].redeemHandler(redeemData, globals.bots[userID]);
											});
										});
									}
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