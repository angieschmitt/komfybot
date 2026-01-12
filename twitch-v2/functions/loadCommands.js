const axios = require('axios');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	async function(client, globals, userID, reset = false) {

		client.commands = [];
		client.commands['global'] = [];
		client.commands['user'] = [];

		if (reset) {
			Object.entries(client.commands).forEach(([channel]) => {
				client.commands[channel] = [];
				// Wipe out exisiting commands, and cache of them
				client.commands[channel] = new Array();
			});
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		// Handle the folder first...
		const foldersPath = path.join(__dirname, '../commands');
		const commandFolders = fs.readdirSync(foldersPath);

		for (const folder of commandFolders) {
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);

				if (command.disabled !== true) {
					if (command.channel !== '' && command.channel !== undefined) {
						if (typeof command.channel == 'object') {
							// eslint-disable-next-line no-unused-vars
							Object.entries(command.channel).forEach(([key, channel]) => {
								if (!(channel in client.commands)) {
									client.commands['user'] = [];
								}
								client.commands['user'][command.name] = command;

								if (command.aliases !== undefined && Object.keys(command.aliases).length > 0) {
									Object.entries(command.aliases).forEach(([key, data]) => {
										module.exports.handleAlias(command, key, data, client.commands['user']);
									});
								}
							});
						}
					}
					else {
						client.commands['global'][command.name] = command;

						if (command.aliases !== undefined && Object.keys(command.aliases).length > 0) {
							Object.entries(command.aliases).forEach(([key, data]) => {
								module.exports.handleAlias(command, key, data, client.commands['global']);
							});
						}
					}
				}
			}
		}

		await axios.get(globals['endpoint'] + 'commands/retrieve/' + userID)
			.then(function(response) {
				if (response.data.status == 'success') {
					const commands = response.data.response;
					Object.entries(commands).forEach(([index, command]) => { // eslint-disable-line no-unused-vars
						Object.entries(command).forEach(([name, data]) => {

							// If we've altered a global command, overwrite the default function...
							if (name in client.commands['global']) {
								client.commands['global'][name]['actions']['default'] = data;
							}
							// If it's a user created on, add it to the list..
							else if (!(name in client.commands['user'])) {
								client.commands['user'][name] = [];
								client.commands['user'][name]['name'] = name;
								client.commands['user'][name]['list'] = data['list'];

								delete data['list'];

								client.commands['user'][name]['actions'] = [];
								client.commands['user'][name]['actions']['default'] = data;
							}

							// Handle Aliases
							if ('aliases' in data) {
								Object.entries(data['aliases']).forEach(([alias]) => {
									client.commands['user'][alias] = [];
									client.commands['user'][alias]['alias'] = name;
									client.commands['user'][alias]['arg'] = false;
									client.commands['user'][alias]['list'] = false;
								});
							}
						});
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				return client;
			});
	},
	handleAlias(baseCommand, name, details, commands) {
		if (!('disabled' in details)) {
			commands[name] = {
				'alias': baseCommand['name'],
			};
			if (details.arg) {
				commands[name]['arg'] = details.arg;
			}
			if (details.list === false) {
				commands[name]['list'] = false;
			}
		}
		return commands;
	},
};