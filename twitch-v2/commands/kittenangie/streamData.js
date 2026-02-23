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
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {
				let content = '';

				content += ' Live: ' + (client.isLive ? 'Yes' : 'No');
				functions.sayHandler(client, content);
			},
		},
		chaos: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {

				if ('chaos-mode' in client.overlay) {
					if ('data' in client.overlay['chaos-mode']) {
						let content = 'Chaos mode word list: ';
						Object.entries(client.data.chaosMode).forEach(([data]) => { // eslint-disable-line no-unused-vars
							content += data + ', ';
						});
						content = content.substring(0, content.length - 2);
						functions.sayHandler(client, content);
					}
				}

			},
		},
		chatters: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {

				let content = ' Chatters: ' + (client.data.chatters.length ? client.data.chatters : 'None');
				content = content.substring(0, content.length - 2);
				content = content.trim();
				functions.sayHandler(client, content);
			},
		},
		timer: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {

				const content = `${tags.username}, this is delayed content...`;

				// Timer for output...
				client.timeouts.make(
					'checkTimer',
					(client, content) => {
						functions.sayHandler(client, content);
						client.timeouts.clear('checkTimer');
					},
					5000, client, content,
				);
			},
		},
		event: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {
				// const userstate = {
				// 	'display-name': tags['username'],
				// 	'bits': 100,
				// 	'message': message,
				// };
				// // Manually emit the event to test logic
				// client.emit('cheer', channel, userstate, message);
				client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'target': 'discord:' + client.userID, 'offline' : client.userID }, 'source': 'komfybot' }));
			},
		},
	},
};