const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'count',
	help: 'Outputs the current value of the counter. Additional arguments: set, reset',
	aliases: {
		'counter': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			help: 'Add your guess to the list. !guess <thing:required>',
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {

				// Get guesser and guess
				const user = channel.replace('#', '');

				// Setup JSON to pass through
				const twitchData = { 'ident_type':'twitch_username', 'ident':user, 'count': 1 };

				let content = '';
				axios.get(data.settings.finalUrl + 'count/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `COUNTER: ${resData.response}`;
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
		set: {
			help: 'Lists out the guesses.',
			execute(args, tags, message, channel, client) {

				// Get guesser and guess
				const user = channel.replace('#', '');

				// Setup JSON to pass through
				let twitchData = false;
				if (args[2]) {
					twitchData = { 'ident_type':'twitch_username', 'ident':user, 'count': parseFloat(args[2]) };
				}
				else {
					twitchData = { 'ident_type':'twitch_username', 'ident':user, 'count': 1 };
				}

				let content = '';
				axios.get(data.settings.finalUrl + 'count/set/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `COUNTER: ${resData.response}`;
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
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {
				const channelName = channel.replace('#', '');

				let content = '';
				axios.get(data.settings.finalUrl + 'count/reset/' + channelName)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = 'Reset the counter!';
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
	},
};