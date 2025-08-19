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

		// If the channel is live... process stuff
		// data.functions.liveCheck(data, channelName)
		// 	.then(res => {
		// 		if (res.live === true || perms.streamer === true || perms.admin === true) {

		// If command was found, do this stuff...
		if (commandData) {
			if (module.exports.handleCommand(commandData, channel, perms, tags, message, client)) {
				console.log('Used command: ' + commandData.command.name + ' ' + (commandData.args[1] ? commandData.args[1] : ''));
			}
		}
		// If not, do this stuff...
		else {

			const triggerWords = { 'komfykiwi' : ['lizard'], 'komfybot' : ['lizard'] };

			// Check for weird message redeems, if it is, we skip currency because spam reasons
			if (triggerWords[channelName].includes(cleanedMessage.toLowerCase())) {
				if (cleanedMessage.toLowerCase() == 'lizard') {
					data.functions.handleWebsocketRedeem('lizard', {}, client);
				}
			}
			else {
				const currencyEnabled = client.commands.global.giveaway.currencyCheck(channelName, client);
				if (currencyEnabled) {
					tags['passiveAmt'] = 2;
					client.commands.komfykiwi.coins.actions.handlePassiveIncome.execute(tags, channel, client);
				}
			}
		}
		// 		}
		// 		else {
		// 			/* eslint-disable-next-line no-lonely-if */
		// 			if (commandData) {
		// 				client.say(channel, data.functions.speakConvertor('Commands are only active while the streamer is live!'));
		// 			}
		// 		}
		// 	})
		// 	.catch(err => console.log(err));

		// React to first message
		if (data.firstMessage[channelName]) {
			const userID = tags['user-id'];
			const firsts = client.extras[channelName].firstMessage;
			if (Object.values(firsts).indexOf(userID) == -1) {
				client.extras[channelName].firstMessage.push(userID);
				console.log('first-message');

				const reaction = module.exports.handleFirstMessage(message, tags, data.firstMessage[channelName]);
				if (reaction) {
					if ('say' in reaction) {
						client.say(channel, reaction['say']);
					}
					if ('execute' in reaction) {
						eval(reaction['execute']);
					}
					console.log('Triggered: first_message');
				}
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
		let output = false;

		// Check user specific first
		if (data[userID]) {
			Object.entries(data[userID]).forEach(([action, response]) => {
				console.log(action);
				if (action == 'say') {
					output = { 'say' : response };
				}
				else if (action == 'execute') {
					output = { 'execute' : response };
				}
			});
		}

		// If output, return.. if not false
		if (output) {
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
};