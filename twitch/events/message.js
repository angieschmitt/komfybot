const axios = require('axios');
const dataFile = require('../data/index');
const data = dataFile.content();

module.exports = {
	eventHandler(channel, tags, message, self) {
		// Get client
		const client = this;

		// Clean channel
		const channelName = channel.replace('#', '');

		// Set last message
		client.last_message[channelName] = message;

		if (self) { return; }
		const cleanedMessage = message.trim();

		const perms = {};
		if ('#' + tags.username == channel) {
			perms.streamer = true;
			perms.mod = true;
		}
		if (tags.mod) { perms.mod = true; }
		if (tags.vip) { perms.vip = true; }
		if (tags.subscriber) { perms.sub = true; }

		// Timestamp
		const formattedTime = module.exports.timeConverter(tags['tmi-sent-ts']);

		console.log(formattedTime);
		// console.log(tags);
		console.log(tags.username + ' : ' + tags['user-id']);
		// console.log(tags['badge-info'].predictions);
		console.log(perms);

		// Handle commands
		if (cleanedMessage.indexOf('!') == 0) {
			// Split into parts to handle things
			const args = cleanedMessage.split(' ');
			let command = args[0].substring(1).toLowerCase();

			if (command in client.commands) {
				let action = {};

				console.log('Used command: ' + command);

				// Check for alias
				if (client.commands[command].alias) {
					if (client.commands[command].arg) {
						args.splice(1, 0, client.commands[command].arg);
					}
					command = client.commands[command].alias;
				}

				// Start with the default action
				action = client.commands[command].actions.default;

				// If args, assign the correct action
				if (args.length !== 1) {
					if (client.commands[command].actions[args[1]]) {
						action = client.commands[command].actions[args[1]];
					}
					else {
						action = client.commands[command].actions.default;
					}
				}

				// If not enabled, stop here
				if ('enabled' in action) {
					if (!action.enabled) {
						return;
					}
				}

				// Handle basic actions
				if ('say' in action) {
					let output = action.say;
					let proceed = true;

					// Handle perms/proceed, assign output if needed
					if (action.perms !== undefined) {
						if (!perms[action.perms.levels]) {
							output = action.perms.error;
							proceed = false;
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
				}
				else if ('execute' in action) {
					let output = '';
					let proceed = true;

					// Handle perms/proceed, assign output if needed
					if (action.perms) {
						if (!perms[action.perms.levels]) {
							output = `${tags.username}, ${action.perms.error}`;
							proceed = false;
						}
					}

					// Handle the action now
					if (proceed) {
						if (action.args) {
							// Find out how many required, start at 2 because !command and first arg
							let count = 2;
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
					}
					else {
						client.say(channel, `${output}`);
					}
				}
			}
		}

		// React to words
		if (data.reactWords[channelName]) {
			const reaction = module.exports.handleReactWords(message, tags, data.reactWords[channelName]);
			console.log(reaction);
			if (reaction) {
				client.say(channel, reaction[1]);

				console.log('Triggered: ' + reaction[0]);
			}
		}

		// Shove in user reference data
		const twitchData = { 'id': tags['user-id'], 'username': tags.username };
		axios.get(data.settings.baseUrl + 'insert/user_reference/?twitch=' + encodeURIComponent(JSON.stringify(twitchData)));

		// Update coin_log
		axios.post(data.settings.baseUrl + 'coins_fix');

		console.log('- - -');
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
};