module.exports = {
	name: 'whale',
	channel: 'komfykiwi',
	help: '🐳🐳🐳🐳🐳🐳',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';

				if (tags['user-id'] !== '16192204') {
					content = 'Hey @ecusare, you\'re a dingus!';
				}

				client.say(channel, `${content}`);
			},
		},
	},
};