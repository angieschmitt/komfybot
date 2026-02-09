const axios = require('axios');

module.exports = {
	name: 'boop',
	help: 'Command to boop someone',
	aliases: {
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				// Get channel and userID
				const viewer = tags['username'];

				let target = client.userID;
				let user = channel.replace('#', '');
				if (args[1]) {
					target = args[1].replace('@', '');
					user = target;
				}

				let content = '';
				axios.get(client.endpoint + 'data/boop/' + target)
					.then(function(response) {
						const resData = response.data;
						const swapText = (resData.response > 1 ? 'times' : 'time');
						if (resData.status === 'success') {
							content += `BegWan @${viewer} booped @${user} on the snoot! `;
							content += `They've been booped ${resData.response} ${swapText}! BegWan`;
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