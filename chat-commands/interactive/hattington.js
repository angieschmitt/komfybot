const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'hattington',
	description: 'Hattington commands',
	help: 'Commands for interacting with Hattington. Additional arguments: set',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];

				axios.get(baseUrl + 'retrieve/hat_inventory?user=' + userID)
					.then(function(response) {
						const data = response.data;
						if (data.status === 'success') {
							content += 'Here\'s whats in your inventory:';
							data.content.forEach(element => {
								content += ' ' + element['name'] + ' ' + element['rarity'] + ' ||';
							});
							content = content.substring(0, content.length - 3);
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
		set: {
			help: 'Put a hat you own on Hattington. !hattington set <hat-name:required>',
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the hat name!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];
				const hat = message.replace(args[0], '').replace(args[1], '').trim();

				axios.get(baseUrl + 'retrieve/hat_inventory?user=' + userID)
					.then(function(response) {
						const data = response.data;
						if (data.status === 'success') {

							let matched = false;
							data.content.forEach(element => {
								if (element['name'].toLowerCase() === hat.toLowerCase()) {
									matched = element;
								}
							});

							if (matched) {
								axios.get(baseUrl + 'interactive/set_hat?userID=' + userID + '&hat=' + matched['hat_id'])
									.then(function(response2) {
										const data2 = response2.data;
										if (data2.status === 'success') {
											content = 'Found your hat, giving it to Hattington!';
										}
										else if (data2.status === 'failure') {
											if (data2.err_msg == 'timeout') {
												content = `Hattington seems to be enjoying their current hat, give them a little time! (Roughly ${data2.time_left} minutes)`;
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
								content = `Seems like you don't have a "${hat}" in your inventory. You might want to check your spelling.`;
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