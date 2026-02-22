const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	async function(type, data, client, reset = false) {
		const parent = this;

		if (reset) {
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		// Otherwise process based on type...
		if (type == 'addons') {
			module.exports.addonsHandler(data, client, reset);
		}
		else if (type == 'commands') {
			module.exports.commandsHandler(data, client, reset);
		}
		else if (type == 'events') {
			module.exports.eventsHandler(data, client, reset);
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
		else if (type == 'store') {
			module.exports.storeHandler(data, client, reset);
		}
		else if (type == 'timers') {
			module.exports.timersHandler(data, client, reset);
			parent.timersHandler(client, true);
		}

		return client;

	},
	addonsHandler(data, client, reset = false) {

		if (!('settings' in client) || reset) {
			client.addons = new Array();
		}

		if (data !== false) {
			client.addons = JSON.parse(data, 'utf-8');
		}

		return client;
	},
	commandsHandler(data, client, reset = false) {

		if (!('commands' in client) || reset) {
			client.commands = new Array();
			client.commands['global'] = new Array();
			client.commands['user'] = new Array();
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
					if (client.settings.commands[command.name] === 0) {
						command.disabled = true;
					}
				}

				if ('addon' in command) {
					if (!client.addons.includes(command.addon)) {
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
		if (data !== false) {
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
		}

		return client;
	},
	eventsHandler(data, client, reset = false) {

		if (!('events' in client) || reset) {
			client.events = new Array();
		}

		if (data !== false) {
			Object.entries(data).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
				client.events[idx] = item;
			});
		}

		return client;
	},
	overlaysHandler(data, client, reset = false) {

		if (!('overlay' in client) || reset) {
			client.overlay = new Array();
		}

		if (data !== false) {
			Object.entries(data).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
				const overlayName = item['name'].toLowerCase().replace(' ', '-');
				client.overlay[overlayName] = [];
				if ('data' in item.content) {
					client.overlay[overlayName]['data'] = item.content.data;
				}
				if ('settings' in item.content) {
					client.overlay[overlayName]['settings'] = item.content.settings;
				}
			});
		}

		return client;
	},
	reactwordsHandler(data, client, reset = false) {

		if (!('reactwords' in client) || reset) {
			client.reactwords = new Array();
		}

		if (data !== false) {
			Object.entries(data).forEach(([uuid, reactWords]) => { // eslint-disable-line no-unused-vars
				client.reactwords[uuid] = {};
				Object.entries(reactWords).forEach(([word, response]) => {
					client.reactwords[uuid][ word ] = response;
				});
			});
		}

		return client;
	},
	redeemsHandler(data, client, reset = false) {

		if (!('redeems' in client) || reset) {
			client.redeems = new Array();
			client.redeems.states = new Array();
		}

		if (data !== false) {
			Object.entries(data).forEach(([index, extra]) => { // eslint-disable-line no-unused-vars
				client.redeems[index] = module.exports.redeemFileHandler(index);
			});
		}

		return client;
	},
	settingsHandler(data, client, reset = false) {

		if (!('settings' in client) || reset) {
			client.settings = new Array();
			client.settings.currency = [];
			client.settings.passive = [];
			client.settings.commands = [];
			client.settings.slots = [];
		}

		if (data !== false) {
			if (Object.keys(data).length) {

				// Handle currency settings
				if ('currency' in data) {
					if ('enabled' in data.currency) {
						// Basic Settings
						client.settings.currency['enabled'] = data.currency.enabled;
						client.settings.currency['name'] = [];
						client.settings.currency['name']['single'] = data.currency.name_single;
						client.settings.currency['name']['plural'] = data.currency.name_plural;
					}
				}
				else {
					client.settings.currency['enabled'] = false;
				}

				if ('passive' in data) {
					if ('enabled' in data.passive) {
						client.settings.passive['enabled'] = data.passive.enabled;
						client.settings.passive['amts'] = [];
						client.settings.passive['amts']['default'] = data.passive.default;
						client.settings.passive['amts']['subscribers'] = data.passive.subscribers;
					}
				}
				else {
					client.settings.passive['enabled'] = false;
				}

				if ('commands' in data) {
					Object.entries(data.commands).forEach(([key, value]) => {
						client.settings.commands[ key ] = value;
					});
				}
				else {
					client.settings.commands = [];
				}

				if ('slots' in data) {
					Object.entries(data.slots).forEach(([key, value]) => {
						client.settings.slots[ key ] = value;
					});
				}
				else {
					client.settings.slots = [];
				}
			}
		}

		return client;
	},
	storeHandler(data, client, reset = false) {

		if (!('store' in client) || reset) {
			client.store = new Array();
			client.store.categories = [];
		}

		if (data !== false) {
			if (Object.keys(data).length) {

				// Handle currency settings
				if ('categories' in data) {
					Object.entries(data.categories).forEach(([idx, details]) => { // eslint-disable-line no-unused-vars
						client.store.categories.push(idx);
					});
				}
				else {
					client.store.categories = [];
				}

			}
		}

		return client;
	},
	timersHandler(data, client, reset = false) {

		if (!('timers' in client) || reset) {
			client.timers = new Array();
		}

		if (data !== false) {
			Object.entries(data).forEach(([index, timer]) => { // eslint-disable-line no-unused-vars
				Object.entries(timer).forEach(([name, data]) => {
					client.timers[name] = [];
					client.timers[name]['timer'] = parseInt(data['timer']);
					client.timers[name]['message'] = data['message'];
				});
			});
		}

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