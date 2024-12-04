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
				const channelToJoin = args[1].replace('@', '');
				client.leave(channelToJoin)
					.then(() => {
						client.say(channel, `Left ${channelToJoin}.`);
						client.say(channelToJoin, data.functions.speakConvertor(`Goodbye! ${tags.username} called me back home!`));
					})
					.catch((error) => {
						data.debug.write(channel, 'LEAVE_ERROR', error);
					});
			},
		},
	},
};