const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');

// Load settings, assign apiKey
const settingsFile = require('./settings');
const settings = settingsFile.content();
axios.defaults.headers.common['Authorization'] = settings.apiKey;

const functions = {
	loadBranch(client, data, branch) {
		client.commands = [];
		client.extras = [];
		client.last_message = [];

		// Create global commands
		client.commands['global'] = [];

		data.debug.init(branch);

		data.settings[branch]['channels'].forEach(channel => {
			// Create channel commands
			client.commands[channel.replace('#', '')] = [];

			// Create channel extras
			client.extras[channel.replace('#', '')] = [];
			client.extras[channel.replace('#', '')].race = [];
			client.extras[channel.replace('#', '')].firstMessage = [];

			// Create channel last_message
			client.last_message[channel.replace('#', '')] = '';
		});
		return client;
	},
	loadEvents(client) {
		const eventsPath = path.join(__dirname, '../events');
		const eventFolders = fs.readdirSync(eventsPath);
		for (const file of eventFolders) {
			const eventName = path.parse(file).name;
			const filePath = path.join(eventsPath, file);
			const eventData = require(filePath);
			client.on(eventName, eventData.eventHandler);
		}
		return client;
	},
	loadCommands(client, reset = false) {

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

		// Assign Commands
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
									client.commands[channel] = [];
								}
								client.commands[channel][command.name] = command;

								if (command.aliases !== undefined && Object.keys(command.aliases).length > 0) {
									Object.entries(command.aliases).forEach(([key, data]) => {
										this.handleAlias(command, key, data, client.commands[channel]);
									});
								}
							});
						}
						else if (typeof command.channel == 'string') {

							if (!(command.channel in client.commands)) {
								client.commands[command.channel] = [];
							}
							client.commands[command.channel][command.name] = command;

							if (command.aliases !== undefined && Object.keys(command.aliases).length > 0) {
								Object.entries(command.aliases).forEach(([key, data]) => {
									this.handleAlias(command, key, data, client.commands[command.channel]);
								});
							}
						}
					}
					else {
						client.commands['global'][command.name] = command;

						if (command.aliases !== undefined && Object.keys(command.aliases).length > 0) {
							Object.entries(command.aliases).forEach(([key, data]) => {
								this.handleAlias(command, key, data, client.commands['global']);
							});
						}
					}
				}
			}
		}

		Object.entries(client.commands).forEach(([channel]) => {
			const ordered = Object.keys(client.commands[channel]).sort().reduce(
				(obj, key) => {
					obj[key] = client.commands[channel][key];
					return obj;
				},
				{},
			);
			client.commands[channel] = ordered;
		});

		return client;
	},
	loadExternalCommands(client, data) {
		Object.entries(client.opts.channels).forEach(([index, channel]) => { // eslint-disable-line no-unused-vars
			channel = channel.replace('#', '');
			axios.get(data.settings.newUrl + 'commands/retrieve/' + channel)
				.then(function(res) {
					if (res.data.status == 'success') {
						const commands = res.data.response;
						Object.entries(commands).forEach(([index, command]) => { // eslint-disable-line no-unused-vars
							Object.entries(command).forEach(([name, data]) => {
								if (name in client.commands['global']) {
									if (!(channel in client.commands['global'][name]['actions'])) {
										client.commands['global'][name]['actions'][channel] = [];
										client.commands['global'][name]['actions'][channel] = data[channel];
									}
								}
								else if (!(name in client.commands[channel])) {
									client.commands[channel][name] = [];
									client.commands[channel][name]['name'] = name;
									client.commands[channel][name]['channel'] = [ channel ];
									client.commands[channel][name]['actions'] = [];
									client.commands[channel][name]['actions']['default'] = data[channel];
								}

								// Handle Aliases
								if ('aliases' in data) {
									Object.entries(data['aliases']).forEach(([alias]) => {
										client.commands[channel][alias] = [];
										client.commands[channel][alias]['alias'] = name;
										client.commands[channel][alias]['arg'] = false;
										client.commands[channel][alias]['list'] = false;
									});
								}
							});
						});
					}
				})
				.catch(console.error);
		});
	},
	loadSettings(client, reset = false) {

		if (reset) {
			Object.entries(client.opts.channels).forEach(([index, channel]) => { // eslint-disable-line no-unused-vars
				channel = channel.replace('#', '');
				client.settings[channel] = [];
			});
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

	},
	loadExternalSettings(client, data) {

		// Set up the container
		client.settings = [];

		// Loop over the channels and get the settings
		Object.entries(client.opts.channels).forEach(([index, channel]) => { // eslint-disable-line no-unused-vars
			channel = channel.replace('#', '');
			axios.get(data.settings.newUrl + 'settings/retrieve/' + channel)
				.then(function(res) {
					client.settings[channel] = [];

					if (res.data.status == 'success') {
						// Lets assign the settings to the channel
						const settings = res.data.response;
						Object.entries(settings).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
							client.settings[channel][key] = value;
						});
					}
				})
				.catch(console.error);
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
	liveCheck(data, channel, extra = false) {
		const chan = channel.toLowerCase();
		return axios.get(data.settings.newUrl + 'live_check/retrieve/' + chan)
			.then(function(res) {
				const resData = res.data;

				const response = [];
				response.live = false;
				if (resData.status === 'success') {
					if (resData.response === '1') {
						response.live = true;
						if (extra) {
							response.extra = extra;
						}
					}
				}

				return response;
			});
	},
	handleTimers(data, timers, client) {
		const parent = this;
		const timerInterval = 60000;
		// const timerInterval = 10000;

		// If not set up, set it up
		if (!('timerOffset' in client)) {
			client.timerOffset = [];
			Object.entries(timers).forEach(([channel]) => {
				client.timerOffset[channel] = 1;
			});
		}

		// Now load in the timerOffsets
		if ('timerOffset' in client) {
			Object.entries(timers).forEach(([channel]) => {
				axios.get(data.settings.newUrl + 'uptime/retrieve/' + channel)
					.then(function(response) {
						if (response.data.status === 'success') {
							client.timerOffset[channel] = (response.data.minutes > 0 ? response.data.minutes : 1);
						}
					})
					.catch(console.error)
					.finally(() => {
						const queue = {};
						queue[channel] = [];

						setInterval(
							function() {
								console.log('Timer - ' + channel + ' : ' + client.timerOffset[channel]);

								// Enter messages into queue
								const channelTimers = timers[channel];
								Object.entries(channelTimers).forEach(([key]) => {
									if ((client.timerOffset[channel] % channelTimers[key]['timer']) == 0) {
										if (parent.isObjectEmpty(queue[channel])) {
											queue[channel][key] = channelTimers[key];
										}
										else {
											const first = Object.keys(queue[channel])[0];
											delete queue[channel][first];
											queue[channel][key] = channelTimers[key];
										}
									}
								});

								// Handle queue
								if (Object.keys(queue[channel]).length > 0) {
									Object.entries(queue[channel]).forEach(([ident]) => {
										const messageData = queue[channel][ident];
										if (client.last_message[channel] !== messageData['message']) {
											parent.liveCheck(data, channel, messageData).then(res => {
												if (res.live === true) {
													console.log('Timer: SENT ' + ident + ' IN ' + channel);
													client.say(channel, res.extra['message']);
													queue[channel] = [];
												}
												else {
													console.log('Timer: SKIPPED - ' + ident + ' IN ' + channel);
													queue[channel] = [];
												}
												console.log('- - -');
											});
										}
									});
								}

								if ((client.timerOffset[channel] % 3) == 0) {
									console.log('-- rechecking timer');
									parent.refreshTimer(channel, data, client);
								}
								else {
									client.timerOffset[channel]++;
								}
								console.log('- - -');
							},
							timerInterval,
						);
					});
			});
		}
	},
	refreshTimer(channel, data, client) {
		if ('timerOffset' in client) {
			axios.get(data.settings.newUrl + 'uptime/retrieve/' + channel)
				.then(function(response) {
					if (response.data.status === 'success') {
						client.timerOffset[channel] = (response.data.minutes > 0 ? response.data.minutes : 1);
					}
				})
				.catch(console.error);
		}
	},
	isObjectEmpty(objectName) {
		return Object.keys(objectName).length === 0 && objectName.constructor === Object;
	},
	speakConvertor(data) {
		const letters = {
			'a': 'ᴀ',
			'b': 'ʙ',
			'c': 'ᴄ',
			'd': 'ᴅ',
			'e': 'ᴇ',
			'f': 'ꜰ',
			'g': 'ɢ',
			'h': 'ʜ',
			'i': 'ɪ',
			'j': 'ᴊ',
			'k': 'ᴋ',
			'l': 'ʟ',
			'm': 'ᴍ',
			'n': 'ɴ',
			'o': 'ᴏ',
			'p': 'ᴘ',
			'q': 'Q',
			'r': 'ʀ',
			's': 'ꜱ',
			't': 'ᴛ',
			'u': 'ᴜ',
			'v': 'ᴠ',
			'w': 'ᴡ',
			'x': 'x',
			'y': 'ʏ',
			'z': 'ᴢ',
		};

		const parts = data.toLowerCase().split('');

		let i = 0;
		let newString = '';
		while (i < parts.length) {
			if (letters[parts[i]] !== undefined) {
				newString += letters[ parts[i] ];
			}
			else {
				newString += parts[i];
			}
			i++;
		}

		return newString;
	},
	checkForCommandRefresh(data, client) {
		const timerInterval = 5000;

		setInterval(
			function() {
				axios.get(data.settings.baseUrl + 'debug/force_refresh/')
					.then(function(res) {
						if (res.data.status === 'success') {
							if (res.data.content === 'commands') {
								console.log('Commands - Refreshed');
								console.log('- - -');
								const tags = [];
								tags['silent'] = true;
								client.commands.global.reload.actions.commands.execute(false, tags, false, false, client);
								axios.get(data.settings.baseUrl + 'debug/force_refresh/?clear');
							}
						}
					})
					.catch(function(error) {
						console.log(error.code);
					});
			},
			timerInterval,
		);
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return functions;
	},
};