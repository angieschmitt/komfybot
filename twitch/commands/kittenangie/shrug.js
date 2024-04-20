module.exports = {
	list: false,
	name: 'shrug',
	help: 'Shrug aggressively',
	aliases: {
		'angy': {
			arg: 'angry',
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				content += '¯\\_(ツ)_/¯';

				client.say(channel, `${content}`);
			},
		},
		angry: {
			help: 'ME MAKE ANGY FACE',
			execute(args, tags, message, channel, client) {
				let content = '';
				content += '╰（‵□′）╯';

				client.say(channel, `${content}`);
			},
		},
	},
};