const axios = require('axios');
const dataFile = require('../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	eventHandler(channel, username, viewers, tags) {
		// Get client
		const client = this;

		if (channel === '#komfykiwi') {
			client.say(channel, `Holy cocoa and blankies, ${username} is raiding with ${viewers} ${(viewers > 1 ? 'viewers' : 'viewer')}!`)
				.then(() => {
					// Handle raid hat?
					if (viewers > 1) {
						let content = '';
						const amount = 160;
						const reason = 'AUTO RAID HAT!';
						axios.get(data.settings.baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&twitch_id=' + tags['user-id'] + '&amount=' + amount + '&reason=' + reason)
							.then(function(response) {
								const output = response.data;
								if (output.status === 'success') {
									content = `WOOOO! Thanks for the raid @${username}, we added ${amount} KomfyCoins to your wallet! You can use !hat buy to get a hat for Hattington!`;
								}
								else if (output.status === 'failure') {
									if (output.err_msg === 'no_twitch_id') {
										content = 'That username doesn\'t seem to be in our system.';
									}
								}
								else {
									content = 'Something went wrong, tell @kittenAngie.';
								}
							})
							.catch(function() {
								content = 'Something went wrong, tell @kittenAngie.';
							})
							.finally(function() {
								client.say(channel, content);
								// axios.post(data.settings.baseUrl + 'coins_fix');
							});
					}
				});
		}
		console.log('caught raid');
		console.log(channel);
		console.log(username);
		console.log(viewers);
		console.log(tags);
	},
};