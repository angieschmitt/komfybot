const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	list: true,
	name: 'help',
	help: 'Provides helpful info for commands. Usage: !help <command:required> ',
	aliases: {},
	actions: {
		default: {
			args: {
				required: [ 1 ],
				error: 'don\'t forgot the command!',
			},
			execute(args, tags, message, channel, client) {

				let content = '';

				let commandLookup = client.commands['user'][args[1]];
				if (commandLookup === undefined) {
					commandLookup = client.commands['global'][args[1]];
				}

				// If we found... something...
				if (commandLookup !== undefined) {
					// If no actions, we have an alias..
					if (!('actions' in commandLookup)) {
						console.log(commandLookup.alias);
						let commandLookup2 = client.commands['user'][commandLookup.alias];
						if (commandLookup2 === undefined) {
							commandLookup2 = client.commands['global'][commandLookup.alias];
						}
						if (commandLookup2 !== undefined) {
							commandLookup = commandLookup2;
						}
					}
				}

				// If we have a proper command now...
				if (commandLookup !== undefined) {
					if ('help' in commandLookup) {
						content = `!${args[1]} : ${commandLookup.help.replace('!' + commandLookup.name, '!' + args[1])}`;
					}
					else {
						content = 'User generated commands do not have help text';
					}
				}
				// If not, we output a placeholder message...
				else {
					content = 'User generated commands do not have help text';
				}

				// let content = client.opts.identity.username + ' has the following commands: ';

				functions.sayHandler(client, content);
			},
		},
	},
};