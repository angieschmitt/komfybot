const axios = require('axios');
const dataFile = require('../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;
// axios.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
// axios.defaults.headers.common['Pragma'] = 'no-cache';
// axios.defaults.headers.common['Expires'] = '0';

module.exports = {
	eventHandler(channel, tags, message, self) {

		// Shared chat is active...
		if ('source-room-id' in tags) {
			// If these ids aren't the same, we don't do anything...
			if (tags['room-id'] !== tags['source-room-id']) {
				return;
			}
		}

		// Get client
		const client = this;

		// Clean channel
		const channelName = channel.replace('#', '');

		// Set last message
		client.last_message[channelName] = message;

		if (self) {
			return;
		}
		if (tags['username'] === 'komfybot') {
			return;
		}
		if (tags['user-id'] === '934821771') {
			return;
		}

		const perms = {};
		if ('#' + tags.username == channel) {
			perms.streamer = true;
			perms.mod = true;
		}
		if (tags.mod) { perms.mod = true; }
		if (tags.vip) { perms.vip = true; }
		if (tags.subscriber) { perms.sub = true; }
		if (tags['user-id'] == '90928645') {
			perms.admin = true;
		}
		else {
			perms.admin = false;
		}

		// Timestamp
		const formattedTime = module.exports.timeConverter(tags['tmi-sent-ts']);

		console.log(formattedTime);
		// console.log(tags);
		console.log(channelName);
		console.log(tags.username + ' : ' + tags['user-id']);
		// console.log(tags['badge-info'].predictions);
		console.log(perms);

		// Let's look for a command
		let commandData = false;
		const cleanedMessage = message.trim();
		if (cleanedMessage.indexOf('!') !== false) {
			// Remove preceding text
			const commandText = cleanedMessage.substr(cleanedMessage.indexOf('!'));

			// Split remaing text into parts to handle things
			const args = commandText.split(' ');

			// Define the main command
			const baseCommand = args[0].substring(1).toLowerCase();

			// Define command buckets
			const channelCommands = client.commands[channelName];
			const globalCommands = client.commands['global'];

			if (channelCommands) {
				commandData = module.exports.locateCommand(baseCommand, args, channelCommands);
			}
			if (!commandData) {
				commandData = module.exports.locateCommand(baseCommand, args, globalCommands, channelName);
			}
		}

		// Setup some stuff for using it...
		const userID = tags['user-id'];
		const chatters = client.extras[channelName].chatters;

		// Passive starts true...
		let passive = true;

		// If command was found, do this stuff...
		if (commandData) {
			if (module.exports.handleCommand(commandData, channel, perms, tags, message, client)) {
				console.log('Used command: ' + commandData.command.name + ' ' + (commandData.args[1] ? commandData.args[1] : ''));

				// No passive for commands...
				passive = false;
			}
		}
		// not a command, so we check for other stuff...
		else if (data.settings.chaosMode == true) {

			// If a single word...
			if (!cleanedMessage.includes(' ')) {

				// If the channel has chaosWords...
				if (channelName in data.chaosWords) {

					// If it's in the channels chaos words...
					if (data.chaosWords[channelName].includes(cleanedMessage.toLowerCase())) {

						console.log('chaosWords: ' + cleanedMessage.toLowerCase());
						if (cleanedMessage.toLowerCase() == 'lizard' || cleanedMessage.toLowerCase() == '🦎') {
							data.functions.handleWebsocketRedeem('lizard', { 'file': 'tts-lizard', 'from': 'chat' }, client);
						}
						else if (cleanedMessage.toLowerCase() == 'v') {
							data.functions.handleWebsocketRedeem('lizard', { 'file': 'tts-vee', 'from': 'chat' }, client);
						}
						else {
							data.functions.handleWebsocketRedeem('lizard', { 'file': 'tts-' + cleanedMessage.toLowerCase(), 'from': 'chat' }, client);
						}

						// Disable passive for spam reasons...
						passive = false;
					}
				}
			}

		}
		// VERY SPECIAL CALL OUT FOR ISSUES...
		else if (cleanedMessage.toLowerCase() === 'force-chaos' && perms.admin == true) {
			data.functions.handleChannelPointRedeem('chaos_mode', 'forced', client, data);

			// Disable passive because it's a command... technically...
			passive = false;
		}
		// fallback check
		else {
			// Nothing doing, enable passive income...
		}

		// Handle passive income if still true...
		if (passive) {
			module.exports.handlePassiveIncome(channelName, tags, client);
		}

		// If streamer has triggers for 'first messages'...
		if (data.firstMessage[channelName]) {
			// And chatter hasn't alread chatted....
			if (Object.values(chatters).indexOf(userID) == -1) {
				// Handle first message reaction
				const reaction = module.exports.handleFirstMessage(message, tags, data.firstMessage[channelName]);
				if (reaction) {
					if ('say' in reaction) {
						Object.entries(reaction['say']).forEach(([idx]) => {
							client.say(channel, reaction['say'][idx]);
						});
					}
					if ('execute' in reaction) {
						Object.entries(reaction['execute']).forEach(([idx]) => {
							if (!eval(reaction['execute'][idx])) {
								reaction['execute'][idx];
							}
						});
					}
					console.log('Triggered: first_message');
				}

				// Then log that they have triggered it in the bot AND the DB...
				module.exports.handleChatterLog(channelName, tags, client);
				console.log('first-message');
			}
		}

		// React to words
		if (data.reactWords[channelName]) {
			const reaction = module.exports.handleReactWords(message, tags, data.reactWords[channelName]);
			if (reaction) {
				client.say(channel, reaction[1]);
				console.log('Triggered: ' + reaction[0]);
			}
		}

		// Shove in user reference data
		const jsonData = {
			'id': tags['user-id'],
			'ident_type': 'twitch_id',
			'data': {
				'twitch_username': tags.username,
			},
		};
		const url = data.settings.finalUrl + 'userdata/update/json/' + encodeURIComponent(JSON.stringify(jsonData));
		axios.get(url);

		// Log the chatter...
		module.exports.handleChatterLog(channelName, tags, client);

		// Update coin_log
		axios.post(data.settings.finalUrl + 'coins/update');

		console.log('- - -');
	},
	locateCommand(command, args, commandMap, channel = false) {
		if (command in commandMap) {
			let action = {};

			// Check for alias
			if ('alias' in commandMap[command]) {
				if (commandMap[command].arg) {
					args.splice(1, 0, commandMap[command].arg);
				}
				// Swap alias for actual command
				command = commandMap[command].alias;
			}

			// Start with the default action
			action = commandMap[command].actions.default;

			// If global, get channel specific if it exists
			if (channel) {
				if (commandMap[command].actions[channel]) {
					action = commandMap[command].actions[channel];
				}
			}

			// Allow override
			if (args.length !== 1) {
				if (commandMap[command].actions[args[1]]) {
					action = commandMap[command].actions[args[1]];
				}
			}

			// If not enabled, stop here
			if ('enabled' in action) {
				if (!action.enabled) {
					return false;
				}
			}

			return { 'command': commandMap[command], 'action': action, 'args': args, 'channel': (channel ? channel : commandMap[command].channel) };
		}
		else {
			return false;
		}
	},
	handleCommand(command, channel, perms, tags, message, client) {
		const action = command.action;
		const args = command.args;
		// const channel = command.channel;

		// Handle basic actions
		if ('say' in action) {
			let output = action.say;
			let proceed = true;

			// Handle perms/proceed, assign output if needed
			if (action.perms !== undefined) {
				if (action.perms) {
					let hasPerm = false;
					for (const [key] of Object.entries(perms)) {
						if (action.perms['levels'].includes(key)) {
							hasPerm = true;
						}
					}
					if (!hasPerm) {
						output = `${tags.username}, ${action.perms.error}`;
						proceed = false;
					}
				}
			}

			// Handle the action now
			// TO DO: Args?
			if (proceed) {
				if (action.args) {
					// Find out how many required, start at 2 because !command and first arg
					let count = 2;
					for (const [key] of Object.entries(action.args)) {
						if (action.args[key][0] === 'r') { count++; }
					}
					// Check full length vs required count
					if (args.length < count) {
						// console.log('Missed an argument');
						return false;
					}

					for (const [key] of Object.entries(action.args)) {
						if (args[(parseInt(key) + 1)] === undefined) {
							if (action.args[key][1] === 'tags.username') {
								output = output.replace('@' + key, tags.username);
							}
						}
						else {
							output = output.replace('@' + key, args[(parseInt(key) + 1)]);
						}
					}
				}
			}

			// Handle special tags in message
			if (output.indexOf('{@sender}') !== -1) {
				output = output.replace('{@sender}', '@' + tags.username);
			}
			if (output.indexOf('{@target}') !== -1) {
				if (args.length > 1) {
					output = output.replace('{@target}', args[1]);
				}
				else {
					client.say(channel, 'You are missing a target for that command.');
					return true;
				}
			}

			// Output output...
			client.say(channel, `${output}`);
			return true;
		}
		else if ('random' in action) {

			let output = module.exports.randomProperty(module.exports.shuffleObject(action.random));
			let proceed = true;

			// Handle perms/proceed, assign output if needed
			if (action.perms !== undefined) {
				if (action.perms) {
					let hasPerm = false;
					for (const [key] of Object.entries(perms)) {
						if (action.perms['levels'].includes(key)) {
							hasPerm = true;
						}
					}
					if (!hasPerm) {
						output = `${tags.username}, ${action.perms.error}`;
						proceed = false;
					}
				}
			}

			// Handle the action now
			// TO DO: Args?
			if (proceed) {
				if (action.args) {
					// Find out how many required, start at 2 because !command and first arg
					let count = 2;
					for (const [key] of Object.entries(action.args)) {
						if (action.args[key][0] === 'r') { count++; }
					}
					// Check full length vs required count
					if (args.length < count) {
						// console.log('Missed an argument');
						return false;
					}

					for (const [key] of Object.entries(action.args)) {
						if (args[(parseInt(key) + 1)] === undefined) {
							if (action.args[key][1] === 'tags.username') {
								output = output.replace('@' + key, tags.username);
							}
						}
						else {
							output = output.replace('@' + key, args[(parseInt(key) + 1)]);
						}
					}
				}
			}

			// Handle special tags in message
			if (output.indexOf('{@sender}') !== -1) {
				output = output.replace('{@sender}', '@' + tags.username);
			}
			if (output.indexOf('{@target}') !== -1) {
				if (args.length > 1) {
					output = output.replace('{@target}', args[1]);
				}
				else {
					client.say(channel, 'You are missing a target for that command.');
					return true;
				}
			}

			// Output output...
			client.say(channel, `${output}`);
			return true;
		}
		else if ('execute' in action) {
			let output = '';
			let proceed = true;

			// Handle perms/proceed, assign output if needed
			if (action.perms) {
				let hasPerm = false;
				for (const [key] of Object.entries(perms)) {
					if (action.perms['levels'].includes(key)) {
						hasPerm = true;
					}
				}
				if (!hasPerm) {
					output = `${tags.username}, ${action.perms.error}`;
					proceed = false;
				}
			}

			// Handle the action now
			if (proceed) {
				if (action.args) {
					// Find out how many required, start at 1 because !command
					let count = 1;
					for (const [key] of Object.entries(action.args)) {
						if (action.args[key][0] === 'r') {
							count++;
						}
					}
					// Check full length vs required count
					if (args.length < count) {
						output = `${tags.username}, ${action.args.error}`;
						proceed = false;
					}
				}
			}

			// Output... something...
			if (!output) {
				action.execute(args, tags, message, channel, client);
				return true;
			}
			else {
				client.say(channel, `${output}`);
				return true;
			}
		}
	},
	handleReactWords(message, tags, words) {
		const userID = tags['user-id'];
		let output = false;

		// Check user specific first
		if (words[userID]) {
			Object.entries(words[userID]).forEach(([match, response]) => {
				if (message.toLowerCase().includes(match)) {
					output = [];
					output[0] = 'user: ' + match;
					output[1] = response.replace('<username>', '@' + tags.username);
				}
			});
		}

		// If no user specific, check globals
		if (!output) {
			if (words[0]) {
				Object.entries(words[0]).forEach(([match, response]) => {
					if (message.toLowerCase().includes(match)) {
						output = [];
						output[0] = 'global: ' + match;
						output[1] = response.replace('<username>', '@' + tags.username);
					}
				});
			}
		}

		// If output, return.. if not false
		if (output) {
			return output;
		}
		return false;
	},
	handleFirstMessage(message, tags, data) {
		const userID = tags['user-id'];
		const output = {};

		// Check user specific first
		if (data[userID]) {
			Object.entries(data[userID]).forEach(([action, response]) => {
				if (action == 'say') {
					output['say'] = response;
				}
				if (action == 'execute') {
					output['execute'] = response;
				}
			});
		}

		// If output, return.. if not false
		if (Object.keys(output).length !== 0) {
			return output;
		}
		return false;
	},
	timeConverter(UNIX_timestamp) {
		const a = new Date(parseInt(UNIX_timestamp));
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const year = a.getFullYear();
		const month = months[a.getMonth()];
		const date = a.getDate();
		const hour = a.getHours();
		const min = (a.getMinutes() < 10 ? '0' : '') + a.getMinutes();
		const sec = (a.getSeconds() < 10 ? '0' : '') + a.getSeconds();
		const milli = (a.getMilliseconds() < 10 ? '0' : '') + a.getMilliseconds();
		const time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec + ':' + milli;
		return time;
	},
	randomProperty(obj) {
		const values = Object.values(obj);
		const random = values[Math.floor(Math.random() * values.length)];
		return random;
	},
	shuffleObject(obj) {
		const entries = Object.entries(obj);
		for (let i = entries.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[entries[i], entries[j]] = [entries[j], entries[i]];
		}
		return Object.fromEntries(entries);
	},
	// user stuff
	handlePassiveIncome(channelName, tags, client) {
		const currencyEnabled = client.commands.global.giveaway.currencyCheck(channelName, client);
		if (currencyEnabled) {
			tags['passiveAmt'] = 2;
			console.log('passive: ' + tags['passiveAmt']);
			client.commands.komfykiwi.coins.actions.handlePassiveIncome.execute(tags, '@' + channelName, client);
		}
	},
	handleChatterLog(channelName, tags, client) {
		const userID = tags['user-id'];
		let chatters = client.extras[channelName].chatters;

		// If user not already in the list...
		if (Object.values(chatters).indexOf(userID) == -1) {
			client.extras[channelName].chatters.push(userID);
		}

		chatters = client.extras[channelName].chatters;

		const chatterData = { 'ident_type':'twitch_username', 'ident':channelName, 'chatter': userID };
		const chatterUrl = data.settings.finalUrl + 'chatters/insert/json/' + encodeURIComponent(JSON.stringify(chatterData));
		axios.get(chatterUrl);
	},
};