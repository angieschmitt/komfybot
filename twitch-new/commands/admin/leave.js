const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'leave',
	help: 'Leave a channel',
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot your channel to leave!',
			},
			execute(args, tags, message, channel, client) {
				const channelToJoin = args[1];
				client.leave(channelToJoin)
					.catch((error) => {
						data.debug.write('LEAVE ERROR: ');
						data.debug.write(error);
					})
					.then(() => {
						client.say(channel, `Left ${channelToJoin}.`);
						client.say(channelToJoin, data.functions.speakConvertor(`Goodbye! ${tags.username} called me back home!`));
					});
			},
		},
	},
};