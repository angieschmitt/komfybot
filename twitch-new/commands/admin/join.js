const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'join',
	help: 'Join a channel',
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot your channel to join!',
			},
			execute(args, tags, message, channel, client) {
				const channelToJoin = args[1].replace('@', '');
				client.join(channelToJoin)
					.catch((error) => {
						data.debug.write('JOIN ERROR: ');
						data.debug.write(error);
					})
					.then(() => {
						client.say(channel, `Joined ${channelToJoin}.`);
						client.say(channelToJoin, data.functions.speakConvertor(`Hi! Hello! ${tags.username} sent me here!`));
					});
			},
		},
	},
};