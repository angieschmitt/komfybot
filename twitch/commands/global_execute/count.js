const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

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
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {

				// Get guesser and guess
				const user = channel.replace('#', '');

				// Setup JSON to pass through
				const twitchData = { 'ident_type':'twitch_username', 'ident':user, 'count': 1 };

				let content = '';
				axios.get(data.settings.newUrl + 'count/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `COUNTER: ${resData.response}`;
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
				axios.get(data.settings.newUrl + 'count/set/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `COUNTER: ${resData.response}`;
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
		reset: {
			help: 'MOD command to reset the guesses.',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				const channelName = channel.replace('#', '');

				let content = '';
				axios.get(data.settings.newUrl + 'count/reset/' + channelName)
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = 'Reset the counter!';
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