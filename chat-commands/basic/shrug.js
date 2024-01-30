module.exports = {
	name: 'shrug',
	help: 'Where did you got those cute Kiwi?',
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