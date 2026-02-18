const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	list: false,
	name: 'check',
	help: 'An assortment of ascii emojis',
	aliases: {
	},
	actions: {
		default: {
			perms: {
				levels: ['streamer', 'mod'],
				error: 'this command is for the streamer and mods only.',
			},
			execute(args, tags, message, channel, client) {
				let content = '';

				content += ' Live: ' + (client.isLive ? 'Yes' : 'No');
				functions.sayHandler(client, content);
			},
		},
		chaos: {
			execute(args, tags, message, channel, client) {

				// Build message...
				let content = 'Chaos mode word list: ';
				Object.entries(client.data.chaosWords).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
					content += idx + ', ';
				});
				content = content.substring(0, content.length - 2);
				functions.sayHandler(client, content);
			},
		},
		chatters: {
			execute(args, tags, message, channel, client) {

				let content = ' Chatters: ' + (client.data.chatters.length ? client.data.chatters : 'None');
				content = content.substring(0, content.length - 2);
				content = content.trim();
				functions.sayHandler(client, content);
			},
		},
	},
};