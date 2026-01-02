const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	list: false,
	name: 'reset',
	help: 'Reset data when starting stream',
	actions: {
		default: {
			perms: {
				levels: ['streamer'],
				error: 'this is a streamer only command.',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const channelName = channel.replace('#', '');
				const twitchData = { 'ident_type':'twitch_username', 'ident': channelName };
				axios.get(data.settings.finalUrl + 'uptime/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(() => {
						axios.get(data.settings.finalUrl + 'guess/reset/' + channelName)
							.then(() => {
								axios.get(data.settings.finalUrl + 'count/reset/' + channelName)
									.then(() => {
										axios.get(data.settings.finalUrl + 'racers/reset/' + channelName)
											.then(() => {
												axios.get(data.settings.finalUrl + 'chatters/reset/' + channelName)
													.then(() => {
														client.extras[channelName].chatters = [];
														content += 'Reset complete!';
													})
													.catch(err => console.log(err))
													.finally(function() {
														client.say(channel, content);
													});
											})
											.catch(err => console.log(err))
											.finally(function() {
												client.say(channel, content);
											});
									})
									.catch(err => console.log(err));
							})
							.catch(err => console.log(err));
					})
					.catch(err => console.log(err));
			},
		},
	},
};