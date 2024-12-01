const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

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

				// Get guesser and guess
				const user = channel.replace('#', '');
				const guesser = tags['username'];
				const guess = message.replace(args[0], '').trim().toLowerCase();

				// Setup JSON to pass through
				let twitchData = false;
				if (!args[1]) {
					twitchData = { 'ident_type':'twitch_username', 'ident':user, 'guesser':guesser, 'guess':guess };
				}
				else {
					twitchData = { 'ident_type':'twitch_username', 'ident':user, 'guesser':guesser, 'guess':guess };
				}

				let content = '';
				axios.get(data.settings.finalUrl + 'guess/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${guesser} guessed ${resData.response}!`;
						}
						else if (resData.status === 'failure') {
							switch (resData.err_msg) {
							case 'guesses_locked':
								content = `@${guesser}, it looks like you missed the window to guess!`;
								break;
							case 'missing_guess':
								content = `Don't forget the pokemon, @${guesser}!`;
								break;
							case 'update_failure':
								content = 'Something went wrong while updating, tell @kittenAngie.';
								break;
							case 'missing_authorization':
								content = 'Authorization issue. Tell @kittenAngie.';
								break;
							default:
								content = 'Something went wrong, tell @kittenAngie.';
								break;
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					}).catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
		list: {
			help: 'Lists out the guesses.',
			execute(args, tags, message, channel, client) {
				const channelName = channel.replace('#', '');

				let content = '';
				axios.get(data.settings.finalUrl + 'guess/retrieve/' + channelName)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							// content = 'Reset the bonks';
							const list = JSON.parse(resData.response);
							if (Object.keys(list).length) {
								Object.entries(list).forEach(([key, value]) => {
									content += `${key}: ${value} || `;
								});
								content = content.substring(0, (content.length - 3));
							}
							else {
								content = 'Seems like there aren\'t any guesses!';
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
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
		reset: {
			help: 'MOD command to reset the guesses.',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				const channelName = channel.replace('#', '');

				let content = '';
				axios.get(data.settings.finalUrl + 'guess/reset/' + channelName)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = 'Reset the guesses!';
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
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
		lock: {
			help: 'MOD command to lock the guesses.',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {

				// Get guesser and guess
				const user = channel.replace('#', '');
				const twitchData = { 'ident_type':'twitch_username', 'ident':user, 'lock':1 };

				let content = '';
				axios.get(data.settings.finalUrl + 'guess/lock/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `Guesses are now ${resData.response}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					}).catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
		unlock: {
			help: 'MOD command to unlock the guesses.',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {

				// Get guesser and guess
				const user = channel.replace('#', '');
				const twitchData = { 'ident_type':'twitch_username', 'ident':user, 'lock':0 };

				let content = '';
				axios.get(data.settings.finalUrl + 'guess/lock/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `Guesses are now ${resData.response}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					}).catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
	},
};