const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const ws = require('ws');

// Load settings, assign apiKey
const settingsFile = require('./settings');
// const e = require('express');
const settings = settingsFile.content();

axios.defaults.headers.common['Authorization'] = settings.apiKey;
// axios.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
// axios.defaults.headers.common['Pragma'] = 'no-cache';
// axios.defaults.headers.common['Expires'] = '0';

const functions = {
	loadBranch(client, data, branch) {
		client.commands = [];
		client.timers = [];
		client.extras = [];
		client.last_message = [];

		// Create global commands
		client.commands['global'] = [];

		data.debug.init(branch);
		data.errorMsg.init(branch);

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
	refreshConnection(data, client) {
		// const interval = 10000;
		const interval = 3600000;
		setInterval(() => {
			if (client.readyState() == 'OPEN') {
				// Update password
				axios.get(data.settings.finalUrl + 'tokens/retrieve/komfybot_token')
					.then(function(response) {
						data.settings[data.currentBranch].identity.password = response.data.response;
					})
					.catch(err => console.log(err))
					.finally(() => {
						// Disconnect, then reconnect
						client.disconnect().catch(err => console.log(err));
						setTimeout(() => {
							client.connect(true).catch(err => console.log(err));
							console.log('Connection - Refreshed');
							console.log('- - -');
						}, 5000);
					});
			}
		}, interval);
		return client;
	},
	// commands
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
			axios.get(data.settings.finalUrl + 'commands/retrieve/' + channel)
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
				.catch(err => console.log(err));
		});
	},
	checkForCommandRefresh(data, client) {
		const timerInterval = 10000;

		setInterval(
			function() {
				axios.get(data.settings.finalUrl + 'force_refresh/retrieve/')
					.then(function(res) {
						if (res.data.status === 'success') {
							if (res.data.response === 'commands') {
								console.log('Commands - Refreshed');
								console.log('- - -');
								const tags = [];
								tags['silent'] = true;
								client.commands.global.reload.actions.commands.execute(false, tags, false, false, client);
								axios.get(data.settings.finalUrl + 'force_refresh/reset/')
									.catch(err => console.log(err));
							}
						}
					})
					.catch(err => console.log(err));
			},
			timerInterval,
		);
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
	// timers
	loadTimers(client, reset = false) {

		if (reset) {
			Object.entries(client.timers).forEach(([channel]) => {
				client.timers[channel] = [];
				// Wipe out exisiting commands, and cache of them
				client.timers[channel] = new Array();
			});
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		const timers = require('./timers');
		const timersData = timers.content();

		// Create the containers
		Object.entries(client.opts.channels).forEach(([index, channel]) => { // eslint-disable-line no-unused-vars
			channel = channel.replace('#', '');
			client.timers[channel] = [];
		});

		// Fill them with local data
		Object.entries(timersData).forEach(([channel, timers]) => {
			Object.entries(timers).forEach(([timer, timerData]) => {
				client.timers[channel][timer] = timerData;
			});
		});

		return client;
	},
	loadExternalTimers(client, data) {
		Object.entries(client.opts.channels).forEach(([index, channel]) => { // eslint-disable-line no-unused-vars
			channel = channel.replace('#', '');
			axios.get(data.settings.finalUrl + 'timers/retrieve/' + channel)
				.then(function(res) {
					if (res.data.status == 'success') {
						const timers = res.data.response;
						Object.entries(timers).forEach(([index, timer]) => { // eslint-disable-line no-unused-vars
							Object.entries(timer).forEach(([name, data]) => {
								client.timers[channel][name] = [];
								client.timers[channel][name]['timer'] = parseInt(data['timer']);
								client.timers[channel][name]['message'] = data['message'];
							});
						});
					}
				})
				.catch(err => console.log(err));
		});
	},
	checkForTimerRefresh(data, client) {
		const timerInterval = 10000;

		setInterval(
			function() {
				axios.get(data.settings.finalUrl + 'force_refresh/retrieve/')
					.then(function(res) {
						if (res.data.status === 'success') {
							if (res.data.response === 'timers') {
								console.log('Timers - Refreshed');
								console.log('- - -');
								const tags = [];
								tags['silent'] = true;
								client.commands.global.reload.actions.timers.execute(false, tags, false, false, client);
								axios.get(data.settings.finalUrl + 'force_refresh/reset/')
									.catch(err => console.log(err));
							}
						}
					})
					.catch(err => console.log(err));
			},
			timerInterval,
		);
	},
	handleTimers(data, client) {
		const parent = this;
		const timerInterval = 60000;
		// const timerInterval = 10000;

		// If not set up, set it up
		if (!('timerOffset' in client)) {
			client.timerOffset = [];
			Object.entries(client.opts.channels).forEach(([index, channel]) => { // eslint-disable-line no-unused-vars
				channel = channel.replace('#', '');
				client.timerOffset[channel] = 1;
			});
		}

		// Now load in the timerOffsets
		if ('timerOffset' in client) {
			Object.entries(client.timers).forEach(([channel]) => {
				axios.get(data.settings.finalUrl + 'uptime/retrieve/' + channel)
					.then(function(response) {
						if (response.data.status === 'success') {
							client.timerOffset[channel] = (response.data.minutes > 0 ? response.data.minutes : 1);
						}
					})
					.catch(err => console.log(err))
					.finally(() => {
						const queue = {};
						queue[channel] = [];

						setInterval(
							function() {
								console.log('Timer - ' + channel + ' : ' + client.timerOffset[channel]);

								// Enter messages into queue
								const channelTimers = client.timers[channel];
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
											parent.liveCheck(data, channel, messageData)
												.then(res => {
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
												})
												.catch(err => console.log(err));
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
			axios.get(data.settings.finalUrl + 'uptime/retrieve/' + channel)
				.then(function(response) {
					if (response.data.status === 'success') {
						client.timerOffset[channel] = (response.data.minutes > 0 ? response.data.minutes : 1);
					}
				})
				.catch(err => console.log(err));
		}
	},
	// settings
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
			axios.get(data.settings.finalUrl + 'settings/retrieve/' + channel)
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
				.catch(err => console.log(err));
		});
	},
	// other funcs
	liveCheck(data, channel, extra = false) {
		const chan = channel.toLowerCase();
		return axios.get(data.settings.finalUrl + 'live_check/retrieve/' + chan)
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
			})
			.catch(err => console.log(err));
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

		if (data.indexOf('@') === -1) {
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
		}
		else {
			return data;
		}
	},
	// Hand the websocket...
	handleWebSocket(data, client) {
		const parent = this;

		// let interval = false;
		const identifier = 'komfybot';
		const websocket = new ws('wss://64.176.216.41:8080/' + identifier, { rejectUnauthorized: false });

		websocket.onopen = () => {
			websocket.send(JSON.stringify({ 'action': 'refresh', 'data': { 'target': 'all' }, 'source': identifier }));
			data.debug.write('global', 'WEBSOCKET_CONNECTED');
		};

		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			// console.log(data);

			// Setup targets for checking against...
			const targets = [];
			if (typeof data.target === 'object') {
				data.target.forEach(element => {
					targets.push(data.userList[ element ]);
				});
			}

			// Now only run if it's supposed to...
			if (data.action === 'ping' && targets.includes('komfybot')) {
				client.say('#komfybot', parent.speakConvertor('Pong!'));
			}
		};

		websocket.onerror = (error) => {
			console.log(error);
		};

		websocket.onclose = (event) => {
			console.log(event.code);
			setTimeout(function() {
				parent.handleWebSocket(data, client);
			}, 1000, data, client);
		};

		client.websocket = websocket;

	},
	// channel points
	handleChannelPoints(data, client) {
		const parent = this;
		setInterval(function() {
			axios.get(data.settings.finalUrl + 'channel_points/insert/')
				.then((response) => {
					const firstPass = [];
					const items = response.data.response;
					if (Object.keys(items).length > 0) {
						Object.entries(items).forEach(([key, value]) => {
							parent.handleChannelPointRedeem(key, value[0], client, data);
							firstPass.push(value[0].toString());
						});
					}

					axios.get(data.settings.finalUrl + 'channel_points/retrieve/')
						.then((response) => {
							if ('response' in response.data) {
								const items = response.data.response;
								if (Object.keys(items).length > 0) {
									Object.entries(items).forEach(([key, values]) => {
										for (let i = 0; i < values.length; i++) {
											if (!firstPass.includes(values[i])) {
												parent.handleChannelPointRedeem(key, values[i], client, data);
											}
										}
									});
								}
							}
						}).catch(err => console.log(err));
				}).catch(err => console.log(err));
		}, 5000);
	},
	handleChannelPointRedeem(key, value, client, data) {
		let message = false;
		const parent = this;
		switch (key) {
		case 'bird_swarm':
			parent.handleWebsocketRedeem('birbs', { 'redeemId': value }, client);
			break;
		case 'coin_convert':
			parent.handleCoinConvert(value, data, client);
			break;
		case 'loading':
			// parent.handleLoading(data, client);
			break;
		case 'chaos_mode':

			data.settings.chaosMode = true;

			parent.handleWebsocketRedeem('lizard', { 'redeemId': value }, client);

			// Build message...
			message = 'Chaos mode word list: ';
			Object.entries(data.chaosWords['komfykiwi']).forEach(([idx]) => {
				message += data.chaosWords['komfykiwi'][idx] + ', ';
			});

			// Now say the message in kiwi's channel
			client.say('komfykiwi', message.substring(0, message.length - 2));

			// Start timer to turn it off...
			setTimeout(function() {
				data.settings.chaosMode = false;
			}, 90000);

			break;
		case 'pop_cat':
			parent.handleWebsocketRedeem('popcat', { 'redeemId': value }, client);
			break;
		case 'stream_color':
			parent.handleLights(data);
			break;
		case 'vip_level_1':
			// parent.handleVIP(data, client);
			break;
		case 'vip_level_2':
			// parent.handleVIP(data, client);
			break;
		case 'vip_level_3':
			// parent.handleVIP(data, client);
			break;
		default:
			break;
		}
	},
	// Actual Channel Point functions
	handleLights(data) {
		axios.get(data.settings.finalUrl + 'channel_points/retrieve/stream_color')
			.then((response) => {
				if (response.data.status == 'success') {
					axios.get(data.settings.finalBase + 'redeems/lights/update/' + response.data.response);
				}
			}).catch(err => console.log(err));
	},
	handleVIP(data) {
		axios.get(data.settings.finalBase + 'redeems/vip/manage');
	},
	handleCoinConvert(redeemID, data, client) {
		const parent = this;

		axios.get(data.settings.finalBase + 'redeems/coins/convert/' + redeemID)
			.then((response2) => {
				if (response2.data.status == 'success') {
					client.say('#komfykiwi', parent.speakConvertor('Redeem processed!'));
				}
			})
			.catch(err => console.log(err));
	},
	// Websocket powered
	handleWebsocketRedeem(target, data, client) {

		// Slide the target into the data
		data['target'] = target;

		client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': data, 'source': 'komfybot' }));
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return functions;
	},
};