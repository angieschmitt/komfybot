const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	name: 'clip',
	help: 'Make a quick clip of the stream. Usage: !clip',
	allowOffline: false,
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				const viewer = tags['username'];

				let content = '';
				axios.get(client.endpoint + 'clip/insert/' + client.userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${viewer} generated a clip! Check it out at: ${resData.response}`;
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
								client.debug.write(client.channel, 'clip-default', 'Failed response');
							}
						}
						else {
							client.debug.write(client.channel, 'clip-default', 'Not sure how you got here');
						}
					})
					.catch(function() {
						client.debug.write(client.channel, 'clip-default', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, 'Creating clip...');

							// Timer for output...
							client.timeouts.make(
								'clipTimer',
								(client, content) => {
									functions.sayHandler(client, content);
									client.timeouts.clear('clipTimer');
								},
								5000, client, content,
							);
						}
					});
			},
		},
	},
};