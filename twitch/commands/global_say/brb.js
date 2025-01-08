module.exports = {
	list: false,
	name: 'brb',
	help: 'Streamer be right back message',
	actions: {
		default: {
			perms: {
				levels: ['streamer'],
				error: 'this is a streamer only command.',
			},
			say: 'I\'ll be right back!',
		},
	},
};