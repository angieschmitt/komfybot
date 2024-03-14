module.exports = {
	list: false,
	name: 'shrug',
	help: 'IDFK',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				content += '¯\\_(ツ)_/¯';

				client.say(channel, `${content}`);
			},
		},
	},
};