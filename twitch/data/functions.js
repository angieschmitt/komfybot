const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');

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
			client.extras[channel.replace('#', '')].guessActive = true;

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
		return axios.get(data.settings.newUrl + 'live_check/insert')
			.then(function(res) {
				const resData = res.data;
				const response = [];
				// eslint-disable-next-line
				if (resData.response.hasOwnProperty(chan)) {
					response.live = true;
				}
				else {
					response.live = false;
				}

				if (extra) {
					response.extra = extra;
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

								if ((client.timerOffset[channel] % 5) == 0) {
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
};

// mymodule.js
module.exports = {
	content: function() {
		return functions;
	},
};