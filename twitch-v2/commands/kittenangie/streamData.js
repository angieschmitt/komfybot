module.exports = {
	list: false,
	channel: ['1'],
	name: 'streamdata',
	help: 'An assortment of ascii emojis',
	aliases: {
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';

				content += ' Live: ' + (client.isLive ? 'Yes' : 'No') + ' ||';
				content += ' Chatters: ' + (client.data.chatters.length ? client.data.chatters : 'None') + ' ||';
				content = content.substring(0, content.length - 2);
				content = content.trim();

				client.say(channel, `${content}`);
			},
		},
	},
};