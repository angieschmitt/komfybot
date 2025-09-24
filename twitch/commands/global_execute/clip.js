const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'clip',
	// disabled: true,
	help: 'Make a quick clip of the stream',
	actions: {
		default: {},
		komfykiwi: {
			// perms: {
			// 	levels: ['streamer'],
			// 	error: 'This is a streamer only command',
			// },
			execute(args, tags, message, channel, client) {

				// Get who requested it
				const channelName = channel.replace('#', '');
				const userName = tags['username'];

				// Setup JSON to pass through
				const twitchData = { 'ident_type':'twitch_username', 'ident':channelName };

				let content = '';
				axios.get(data.settings.finalUrl + 'clip/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {

							client.say(channel, data.functions.speakConvertor('Generating a clip, please be patient! It can take up to 20 seconds!'));

							setTimeout((userName, data, resData, content, channel, client) => {
								axios.get(data.settings.finalUrl + 'clip/retrieve/' + encodeURIComponent(resData.response))
									.then(function(response2) {
										const resData2 = response2.data;
										if (resData2.status === 'success') {
											const resData2 = response2.data;
											content = `@${userName} generated a clip! Check it out at: ${resData2.response}`;
										}
										else if (resData2.status === 'failure') {
											data.errorMsg.handle(channel, client, 'clip-komfykiwi', 'Failed response');
										}
									})
									.catch(function() {
										data.errorMsg.handle(channel, client, 'clip-komfykiwi', 'Issue while handling command');
									})
									.finally(function() {
										if (content !== '') {
											client.say(channel, content);
										}
									});
							}, 20000, userName, data, resData, content, channel, client);
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg) {
								data.errorMsg.handle(channel, client, 'clip-komfykiwi', resData.err_msg);
							}
							else {
								data.errorMsg.handle(channel, client, 'clip-komfykiwi', 'Failed response');
							}
						}
						else {
							data.errorMsg.handle(channel, client, 'clip-komfykiwi', 'Not sure how you got here');
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'clip-komfykiwi', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, content);
						}
					});

			},
		},
	},
};