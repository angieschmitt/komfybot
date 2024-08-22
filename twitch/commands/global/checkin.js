const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: 'checkin',
	help: 'Command to checkin to a stream. Additional arguments: set',
	aliases: {
        'ch': {
			arg: false,
		},
        'shrekin': {
			arg: false,
		},
        'checking': {
			arg: false,
		},
        'chicken': {
			arg: false,
		},
	},
	actions: {
		default: {
			help: 'Checkin to the stream. !checkin',
			execute(args, tags, message, channel, client) {
				// Get channel and userID
				const channelName = channel.replace('#', '');
				const user = tags['username'];
				const userID = tags['user-id'];

				// Setup JSON to pass through
				const twitchData = { 'ident_type':'twitch_username', 'ident':channelName, 'userID':userID };

				let content = '';
				axios.get(data.settings.newUrl + 'checkin/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						const swapText = (resData.response > 1 ? 'checkins' : 'checkin');
						if (resData.status === 'success') {
							content = `Welcome in @${user}! You're at ${resData.response} ${swapText}!`;
						}
						else if (resData.status === 'failure') {
							switch (resData.err_msg) {
							case 'already_checked_in':
								content = `@${user}, you're at ${resData.response} ${swapText}, but it looks like you already checked in today.`;
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
		set: {
			help: 'Set a users amount of checkins.',
			args: {
				1: [ 'r' ],
				2: [ 'r' ],
				error: 'don\'t forgot the user or the amount!',
			},
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {

				// Get channel and userID
				const channelName = channel.replace('#', '');

				let username, amount = false;
				if (args[2]) {
					username = args[2].replace('@', '');
				}
				if (args[3]) {
					amount = args[3];
				}

				// Setup JSON to pass through
				const twitchData = { 'ident_type':'twitch_username', 'ident':channelName, 'username':username, 'amount':amount };

				let content = '';
				axios.get(data.settings.newUrl + 'checkin/set/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `Updated checkins for ${username}, set them to ${resData.response}`;
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