const fs = require('node:fs');
const path = require('node:path');

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

				// Wipe out exisiting commands, and cache of them
				client.commands = new Array();
				for (const i in require.cache) {
					delete require.cache[i];
				}

				const foldersPath = path.join(__dirname, '..');
				const commandFolders = fs.readdirSync(foldersPath);

				// Skip aliases
				for (const folder of commandFolders) {
					if (folder !== 'aliases') {
						const commandsPath = path.join(foldersPath, folder);
						const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
						for (const file of commandFiles) {
							const filePath = path.join(commandsPath, file);
							const command = require(filePath);

							if (command.disabled !== true) {
								client.commands[command.name] = command;
							}
						}
					}
				}

				// Now we handle aliases
				for (const folder of commandFolders) {
					if (folder === 'aliases') {
						const commandsPath = path.join(foldersPath, folder);
						const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
						for (const file of commandFiles) {
							const filePath = path.join(commandsPath, file);
							const command = require(filePath);

							if (command.alias in client.commands) {
								client.commands[command.name] = command;
							}
						}
					}
				}

				// Order them alpha
				const ordered = Object.keys(client.commands).sort().reduce(
					(obj, key) => {
						obj[key] = client.commands[key];
						return obj;
					},
					{},
				);

				client.commands = ordered;

				client.say(channel, 'Reloaded commands.');
			},
		},
	},
};