const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'reload',
	help: 'Reload stuff for the bot',
	aliases: {
		'relcmd': {
			arg: 'commands',
			list: false,
		},
		'relset': {
			arg: 'settings',
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
				client.say(channel, 'The commands have changed, ask @kittenangie.');
			},
		},
		commands: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				data.functions.loadCommands(client, true);
				data.functions.loadExternalCommands(client, data);

				const content = 'Reloaded commands.';
				if ('silent' in tags) {
					if (tags.silent !== true) {
						client.say(channel, content);
					}
				}
				else {
					client.say(channel, content);
				}
			},
		},
		settings: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				data.functions.loadSettings(client, true);
				data.functions.loadExternalSettings(client, data);
				client.say(channel, 'Reloaded settings.');
			},
		},
	},
};