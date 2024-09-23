const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'reset',
	help: 'Reset data when starting stream',
	actions: {
		default: {
			perms: {
				levels: ['streamer'],
				error: 'This is a streamer only command',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const channelName = channel.replace('#', '');
				const twitchData = { 'ident_type':'twitch_username', 'ident': channelName };
				axios.get(data.settings.newUrl + 'uptime/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(() => {
						axios.get(data.settings.newUrl + 'guess/reset/' + channelName)
							.then(() => {
								axios.get(data.settings.newUrl + 'count/reset/' + channelName)
									.then(() => {
										if (channelName == 'komfykiwi') {
											axios.get(data.settings.newUrl + 'racers/reset')
												.then(() => {
													content = 'Reset Uptime, Guesses, Racers, and the counter!';
												})
												.finally(function() {
													client.say(channel, content);
												});
										}
										else {
											content = 'Reset Uptime, Guesses, and the counter!';
										}
									})
									.finally(function() {
										client.say(channel, content);
									});
							});
					});
			},
		},
	},
};