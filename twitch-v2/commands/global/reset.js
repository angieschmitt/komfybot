module.exports = {
	list: false,
	name: 'reset',
	help: 'Reset data when starting stream',
	actions: {
		default: {
			perms: {
				levels: ['streamer'],
				error: 'this is a streamer only command.',
			},
			execute(args, tags, message, channel, client) {
				client.timerOffset[channel] = 1;
			},
		},
	},
};