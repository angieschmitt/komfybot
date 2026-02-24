const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

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
								client.debug.write(channel, 'boop-default', 'Authorization issue');
							}
							else {
								client.debug.write(channel, 'boop-default', 'Failed response');
							}
						}
						else {
							client.debug.write(channel, 'boop-default', 'Not sure how you got here');
						}
					})
					.catch(function() {
						client.debug.write(channel, 'boop-default', 'Issue while handling command');
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