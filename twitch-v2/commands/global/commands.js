const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	list: false,
	name: 'commands',
	help: 'Outputs a list of available commands. Usage: !commands',
	aliases: {
		'cmds': {
			arg: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				let content = client.opts.identity.username + ' has the following commands: ';

				// Build out the command list
				let commandList = [];

				// If channel has commands, add them to the list
				if (client.commands['user']) {
					Object.entries(client.commands['user']).forEach(([key, value]) => {
						let cmdOut = true;

						if ('disabled' in value) {
							if (value.disabled == true) {
								cmdOut = false;
							}
						}
						if ('list' in value) {
							if (value.list == false) {
								cmdOut = false;
							}
						}
						if (cmdOut == true) {
							commandList.push(key);
						}
					});
				}
				// Chuck the global ones in there too
				Object.entries(client.commands['global']).forEach(([key, value]) => {
					let cmdOut = true;
					if ('disabled' in value) {
						if (value.disabled == true) {
							cmdOut = false;
						}
					}
					if ('list' in value) {
						if (value.list == false) {
							cmdOut = false;
						}
					}
					if (cmdOut == true) {
						commandList.push(key);
					}
				});
				// Sort them alpha style
				commandList = commandList.sort();
				// Turn it into a string, amd clean it
				commandList.forEach(element => {
					content += '!' + element + ', ';
				});
				content = content.trim().slice(0, -1);

				functions.sayHandler(client, content);
			},
		},
	},
};