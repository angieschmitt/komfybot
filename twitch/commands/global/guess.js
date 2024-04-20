const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'guess',
	help: 'Add your guesses to the list. Additional args: list, reset, lock, unlock',
	actions: {
		default: {
			help: 'Add your guess to the list. !pkmn guess <pokemon-name:required>',
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot your guess!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const username = tags['username'];
				const guess = message.replace(args[0], '').trim().toLowerCase();

				const channelClean = channel.replace('#', '');

				if (client.extras[channelClean].guessActive != false) {
					axios.get(baseUrl + 'insert/guesses?username=' + username + '&guess=' + guess)
						.then(function(response) {
							const data = response.data;
							if (data.status === 'success') {
								content = data.content;
							}
							else if (data.status === 'failure') {
								switch (data.err_msg) {
								case 'missing_guess':
									content = 'Don\'t forget the pokemon!';
									break;
								case 'update_failure':
									content = 'Something went wrong while updating, tell @kittenAngie.';
									break;
								default:
									content = 'Something went wrong, tell @kittenAngie.';
									break;
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
					client.say(channel, 'Seems like you missed the window to guess!');
				}
			},
		},
		list: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'retrieve/guesses')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							// content = 'Reset the bonks';
							const list = JSON.parse(output.content);
							Object.entries(list).forEach(([key, value]) => {
								content += `${key}: ${value} || `;
							});
							content = content.substring(0, (content.length - 3));
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
		reset: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'insert/guesses?reset')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = output.content;
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
		lock: {
			execute(args, tags, message, channel, client) {
				const channelClean = channel.replace('#', '');

				client.extras[channelClean].guessActive = false;
				client.say(channel, 'Guesses locked!');
			},
		},
		unlock: {
			execute(args, tags, message, channel, client) {
				const channelClean = channel.replace('#', '');

				client.extras[channelClean].guessActive = true;
				client.say(channel, 'Guesses unlocked!');
			},
		},
	},
};

// function ucwords(string) {
// 	return string.toLowerCase().replace(/(?<= )[^\s]|^./g, a => a.toUpperCase());
// }

// function randomIntFromInterval(min, max) {
// 	return Math.floor(Math.random() * (max - min + 1) + min);
// }