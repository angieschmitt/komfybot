const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: 'clip',
	help: 'Make a quick clip of the stream',
	actions: {
		default: {},
		komfykiwi: {
			perms: {
				levels: ['streamer'],
				error: 'This is a streamer only command',
			},
			execute(args, tags, message, channel, client) {

				// Get who requested it
				const channelName = channel.replace('#', '');
				const userName = tags['username'];

				// Setup JSON to pass through
				const twitchData = { 'ident_type':'twitch_username', 'ident':channelName };

				let content = '';
				axios.get(data.settings.newUrl + 'clip/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${userName} generated a clip! Check it out at: ${resData.response}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg) {
								content = resData.err_msg;
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