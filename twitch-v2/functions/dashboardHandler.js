const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	async function(type, data, client, reset = false) {
		const parent = this;

		// If it's just empty data, return early...
		if (data === false) {
			return client;
		}

		// Otherwise process based on type...
		if (type == 'addons') {
			module.exports.addonsHandler(data, client, reset);
		}
		else if (type == 'commands') {
			module.exports.commandsHandler(data, client, reset);
		}
		else if (type == 'overlays') {
			module.exports.overlaysHandler(data, client, reset);
		}
		else if (type == 'reactwords') {
			module.exports.reactwordsHandler(data, client, reset);
		}
		else if (type == 'redeems') {
			module.exports.redeemsHandler(data, client, reset);
		}
		else if (type == 'settings') {
			module.exports.settingsHandler(data, client, reset);
		}
		else if (type == 'timers') {
			module.exports.timersHandler(data, client, reset);
			parent.timersHandler(client);
		}

		if (reset) {
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		return client;

	},
	addonsHandler(data, client, reset = false) {
		if (reset) {
			client.settings.addons = new Array();
		}

		if (!('settings' in client)) {
			client.settings = [];
		}

		client.settings.addons = JSON.parse(data, 'utf-8');

		return client;
	},
	commandsHandler(data, client, reset = false) {
		if (reset) {
			Object.entries(client.commands).forEach(([channel]) => {
				client.commands[channel] = [];
				client.commands[channel] = new Array();
			});
		}

		if (!('commands' in client)) {
			client.commands = [];
			client.commands['global'] = [];
			client.commands['user'] = [];
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

				if (command.name in client.settings.commands) {
					if (client.settings.commands[command.name] == 0) {
						command.disabled = true;
					}
				}

				if ('addon' in command) {
					if (!client.settings.addons.includes(command.addon)) {
						command.disabled = true;
					}
				}

				if (command.disabled !== true) {
					if (command.channel !== '' && command.channel !== undefined) {
						if (typeof command.channel == 'object') {
							Object.entries(command.channel).forEach(([key, channel]) => { // eslint-disable-line no-unused-vars
								if (client.userID == channel) {
									client.commands['user'][command.name] = command;

									if (command.aliases !== undefined && Object.keys(command.aliases).length > 0) {
										Object.entries(command.aliases).forEach(([key, data]) => {
											module.exports.handleAlias(command, key, data, client.commands['user']);
										});
									}
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

		// Now handle the commands from the dashboard...
		Object.entries(data).forEach(([index, command]) => { // eslint-disable-line no-unused-vars
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
					client.commands['user'][name]['allowOffline'] = data['allowOffline'];

					delete data['list'];
					delete data['allowOffline'];

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

		return client;
	},
	overlaysHandler(data, client, reset = false) {
		if (reset) {
			client.overlay = new Array();
		}

		if (!('overlay' in client)) {
			client.overlay = [];
		}

		Object.entries(data).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
			const overlayContent = JSON.parse(item['content']);
			client.overlay[item['name'].toLowerCase()] = [];
			if ('data' in overlayContent) {
				client.overlay[item['name'].toLowerCase()]['data'] = overlayContent['data'];
			}
			if ('settings' in overlayContent) {
				client.overlay[item['name'].toLowerCase()]['settings'] = overlayContent['settings'];
			}
		});

		return client;
	},
	reactwordsHandler(data, client, reset = false) {
		if (reset) {
			client.reactwords = new Array();
		}

		if (!('reactwords' in client)) {
			client.reactwords = {};
		}

		Object.entries(data).forEach(([uuid, reactWords]) => { // eslint-disable-line no-unused-vars
			client.reactwords[uuid] = {};
			Object.entries(reactWords).forEach(([word, response]) => {
				client.reactwords[uuid][ word ] = response;
			});
		});

		return client;
	},
	redeemsHandler(data, client, reset = false) {
		if (reset) {
			client.redeems = new Array();
			client.redeems.states = new Array();
		}

		if (!('redeems' in client)) {
			client.redeems = [];
			client.redeems.states = [];
		}

		const redeemsJson = JSON.parse(data);
		Object.entries(redeemsJson).forEach(([index, extra]) => { // eslint-disable-line no-unused-vars
			client.redeems[index] = module.exports.redeemFileHandler(index);
		});
		return client;
	},
	settingsHandler(data, client, reset = false) {
		if (reset) {
			client.settings.currency = new Array();
			client.settings.passive = new Array();
			client.settings.commands = new Array();
		}

		if (!('settings' in client)) {
			client.settings = [];
		}

		const settingsJson = JSON.parse(data, 'utf-8');
		if (Object.keys(settingsJson).length) {

			client.settings.currency = [];
			client.settings.passive = [];
			client.settings.commands = [];
			client.settings.slots = [];

			// Handle currency settings
			if ('currency' in settingsJson) {
				if ('enabled' in settingsJson.currency) {
					// Basic Settings
					client.settings.currency['enabled'] = settingsJson.currency.enabled;
					client.settings.currency['name'] = [];
					client.settings.currency['name']['single'] = settingsJson.currency.name_single;
					client.settings.currency['name']['plural'] = settingsJson.currency.name_plural;
				}
			}
			else {
				client.settings.currency['enabled'] = false;
			}

			if ('passive' in settingsJson) {
				if ('enabled' in settingsJson.passive) {
					client.settings.passive['enabled'] = settingsJson.passive.enabled;
					client.settings.passive['amts'] = [];
					client.settings.passive['amts']['default'] = settingsJson.passive.default;
					client.settings.passive['amts']['subscribers'] = settingsJson.passive.subscribers;
				}
			}
			else {
				client.settings.passive['enabled'] = false;
			}

			if ('commands' in settingsJson) {
				Object.entries(settingsJson.commands).forEach(([key, value]) => {
					client.settings.commands[ key ] = value;
				});
			}
			else {
				client.settings.commands = [];
			}

			if ('slots' in settingsJson) {
				Object.entries(settingsJson.slots).forEach(([key, value]) => {
					client.settings.slots[ key ] = value;
				});
			}
			else {
				client.settings.slots = [];
			}
		}

		return client;
	},
	timersHandler(data, client, reset = false) {
		if (reset) {
			client.timers = new Array();
		}

		if (!('timers' in client)) {
			client.timers = [];
		}

		Object.entries(data).forEach(([index, timer]) => { // eslint-disable-line no-unused-vars
			Object.entries(timer).forEach(([name, data]) => {
				client.timers[name] = [];
				client.timers[name]['timer'] = parseInt(data['timer']);
				client.timers[name]['message'] = data['message'];
			});
		});

		return client;
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
	redeemFileHandler(redeemID) {
		const redeemFile = require('../redeems/' + redeemID);
		const redeem = redeemFile.content();
		return redeem;
	},
};