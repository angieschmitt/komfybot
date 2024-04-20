// const fs = require('node:fs');
// const path = require('node:path');

const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'reloadcmds',
	help: 'Reloads the commands',
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				data.functions.loadCommands(client, true);
				client.say(channel, 'Reloaded commands.');
			},
		},
	},
};