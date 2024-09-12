// const fs = require('node:fs');
// const path = require('node:path');

const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'reloadcmds',
	help: 'Reloads the commands',
	aliases: {
		'reload': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				data.functions.loadCommands(client, true);
				data.functions.loadExternalCommands(client, data);
				client.say(channel, 'Reloaded commands.');
			},
		},
	},
};