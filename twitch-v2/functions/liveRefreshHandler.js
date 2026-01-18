const axios = require('axios');

// Handle watching for refreshes...
const timerInterval = 10000;

module.exports = {
	async function(globals) {
		setInterval(
			function() {
				axios.get(globals['endpoint'] + 'live/update')
					.then(function(response) {
						if (response.data.status === 'success') {
							const userList = response.data.response;
							Object.entries(userList).forEach(([twitchUUID, userData]) => { // eslint-disable-line no-unused-vars
								globals['bots'][ userData.userID ]['isLive'] = (userData.isLive == '0' ? false : true);
								globals['bots'][ userData.userID ]['streamData'] = userData.streamData;
							});
						}
					})
					.catch(err => console.log(err));
			},
			timerInterval,
		);
	},
};