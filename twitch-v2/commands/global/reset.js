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
			say: 'COMING IF NECESSARY',
		},
	},
};