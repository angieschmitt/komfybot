const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	name: 'followage',
	help: 'Command to retrieve users followage',
	aliases: {
	},
	actions: {
		default: {
			help: 'Checkin to the stream. !checkin',
			execute(args, tags, message, channel, client) {
				// Get channel and userID
				const streamer = channel.replace('#', '');
				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				let content = '';
				axios.get(client.endpoint + 'data/followage/' + client.userID + '/' + viewerID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if ('twitch_date' in resData.response && 'bot_date' in resData.response) {
								content += `Hey @${viewer}, according to Twitch, you've been following ${streamer} for ${resData.response['twitch_date']}! `;
								content += `According to me, you've been here for ${resData.response['bot_date']}!`;
							}
							else {
								if ('twitch_date' in resData.response) {
									content += `Hey @${viewer}, according to Twitch, you've been following ${streamer} for ${resData.response['twitch_date']}!`;
								}
								if ('bot_date' in resData.response) {
									content += `Hey @${viewer}, according to me, you've been following ${streamer} for ${resData.response['bot_date']}!`;
								}
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								// data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
							}
							else {
								// data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
							}
						}
						else {
							// data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
						}
					})
					.catch(function() {
						// data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
						}
					});
			},
		},
	},
};