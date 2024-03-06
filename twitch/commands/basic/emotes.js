module.exports = {
	name: 'emotes',
	help: 'Where did you got those cute Kiwi?',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				content += 'Kiwi\'s emotes are from SakuraArt on Fiverr: https://www.fiverr.com/sakurart2020 .';
				content += 'You can also find them at https://twitter.com/sakurart2020 ';
				content += 'and https://www.instagram.com/sakurart.studio/';

				client.say(channel, `${content}`);
			},
		},
	},
};