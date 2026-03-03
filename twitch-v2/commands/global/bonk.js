const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	name: 'bonk',
	help: 'Command to bonk someone. Usage: !bonk <@username:optional>',
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
				axios.get(client.endpoint + 'data/bonk/' + target)
					.then(function(response) {
						const resData = response.data;
						const swapText = (resData.response > 1 ? 'times' : 'time');
						if (resData.status === 'success') {
							content += `BOP @${user} got bonked by ${viewer}! `;
							content += `They've been bonked ${resData.response} ${swapText}! BOP`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								client.debug.write(client.channel, 'bonk-default', 'Authorization issue');
							}
							else {
								client.debug.write(client.channel, 'bonk-default', 'Failed response');
							}
						}
						else {
							client.debug.write(client.channel, 'bonk-default', 'Not sure how you got here');
						}
					})
					.catch(function() {
						client.debug.write(client.channel, 'bonk-default', 'Issue while handling command');
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