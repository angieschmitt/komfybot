const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'snacks',
	description: 'Hattington snacks',
	help: 'Commands for giving snacks to Hattington. Additional arguments: buy, check, inv, sell, set',
	actions: {
		default: {
			say: 'SOON',
		},
		give: {
			help: 'Give a snack to Hattington. !snack give <snack-name:required>',
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the snack name!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];
				let snack = message.replace(args[0], '').replace(args[1], '').trim().toLowerCase();
				let snackOut = snack;

				if (snack.indexOf(':') === -1) {
					snack = 'snacks : ' + snack;
				}
				else {
					snackOut = snackOut.substring(snackOut.indexOf(':') + 1).toLowerCase().trim();
				}

				axios.get(baseUrl + 'interactive/snacks/inventory?twitch_id=' + userID)
					.then(function(response) {
						const data = response.data;
						if (data.status === 'success') {
							let matched = false;
							Object.entries(data.reference).forEach(([key, value]) => {
								if (key.toLowerCase() === snack.toLowerCase()) {
									if (parseInt(value.qty) > 0) {
										matched = value;
									}
								}
							});

							if (matched) {
								axios.get(baseUrl + 'interactive/snacks/insert?userID=' + userID + '&snack=' + matched['snack_id'] + '&item_id=' + matched['item_id'])
									.then(function(response2) {
										const data2 = response2.data;
										if (data2.status === 'success') {
											content = 'Found your snack, giving it to Hattington!';
										}
										else if (data2.status === 'failure') {
											if (data2.err_msg == 'timeout') {
												content = `Hattington seems to be enjoying their last snack, give them a little time! (Roughly ${data2.time_left} minutes)`;
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
									});
							}
							else {
								content = `Seems like you don't have a "${snackOut}" in your inventory. You might want to check your spelling.`;
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
					});
			},
		},
	},
};