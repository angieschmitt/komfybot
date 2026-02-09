const axios = require('axios');

module.exports = {
	name: 'clip',
	// disabled: true,
	help: 'Make a quick clip of the stream',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				const viewer = tags['username'];

				let content = '';
				axios.get(client.endpoint + 'clip/insert/' + client.userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							setTimeout((resData) => {
								client.say(channel, `@${viewer} generated a clip! Check it out at: ${resData.response}`)
									.catch(() => {
										setTimeout(() => {
											client.say(channel, `@${viewer} generated a clip! Check it out at: ${resData.response}`);
										}, 2500);
									});
							},
							5000, resData);
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'Channel offline.') {
								content = `@${viewer}, you can't clip an offline channel.`;
							}
							else if (resData.err_msg === 'missing_permissions') {
								content = `@${channel.replace('#', '')}, it looks like the bot is missing certain permissions.`;
							}
							else if (resData.err_msg) {
								content = `@${viewer}: Can you please inform @kittenAngie about this error: ${resData.err_msg}.`;
							}
							else {
								// data.errorMsg.handle(channel, client, 'clip-komfykiwi', 'Failed response');
							}
						}
						else {
							// data.errorMsg.handle(channel, client, 'clip-komfykiwi', 'Not sure how you got here');
						}
					})
					.catch(function() {
						// data.errorMsg.handle(channel, client, 'clip-komfykiwi', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, content).catch(() => {
								setTimeout(() => {
									client.say(channel, content);
								}, 2500);
							});
						}
					});
			},
		},
	},
};