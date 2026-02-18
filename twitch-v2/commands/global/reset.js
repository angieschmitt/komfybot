const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

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
				// Local resets...
				// client.timerOffset = 1;
				client.data.chatters = [];

				// Database resets...
				axios.get(client.endpoint + 'data/chatters/' + client.userID + '/reset');

				functions.sayHandler(client, 'Reset complete!');
			},
		},
	},
};