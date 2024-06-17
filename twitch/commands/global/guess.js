const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: 'guess',
	help: 'Add your guesses to the list. Additional args: list, reset, lock, unlock',
	actions: {
		default: {
			help: 'Add your guess to the list. !guess <thing:required>',
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
					axios.get(data.settings.baseUrl + 'insert/guesses?username=' + username + '&guess=' + guess)
						.then(function(response) {
							const resData = response.data;
							if (resData.status === 'success') {
								content = resData.content;
							}
							else if (resData.status === 'failure') {
								switch (resData.err_msg) {
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
			help: 'Lists out the guesses.',
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.baseUrl + 'retrieve/guesses')
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
			help: 'MOD command to reset the guesses.',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.baseUrl + 'insert/guesses?reset')
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
			help: 'MOD command to lock the guesses.',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				const channelClean = channel.replace('#', '');

				client.extras[channelClean].guessActive = false;
				client.say(channel, 'Guesses locked!');
			},
		},
		unlock: {
			help: 'MOD command to unlock the guesses.',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				const channelClean = channel.replace('#', '');

				client.extras[channelClean].guessActive = true;
				client.say(channel, 'Guesses unlocked!');
			},
		},
	},
};