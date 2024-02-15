module.exports = {
	name: 'emotes',
	help: 'Where did you got those cute Kiwi?',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				content += 'Kiwi\'s emotes are from SakuraArt on Fiverr: https://www.fiverr.com/sakurart2020';

				client.say(channel, `${content}`);
			},
		},
	},
};