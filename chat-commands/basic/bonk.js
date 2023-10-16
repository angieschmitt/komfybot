module.exports = {
	name: 'bonk',
	description: 'Bonk the streamer',
	help: 'Bonk the streamer',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				content += `@${channel.substring(1)} got bonked by ${tags.username} BOP BOP`;

				client.say(channel, `${content}`);
			},
		},
	},
};