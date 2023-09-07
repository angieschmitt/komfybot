module.exports = {
	name: 'lurk',
	description: 'Lurk command',
	help: 'Let chat know you\'re going into lurk mode',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				content += `Thank you for lurking, ${tags.username}! Enjoy and have a good time. `;
				content += 'If you do want to mute the stream, please remember to do so via muting ';
				content += 'your BROWSER TAB, and NOT via volume control - thank you! <3';

				client.say(channel, `${content}`);
			},
		},
	},
};