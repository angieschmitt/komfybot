const tmi = require('tmi.js');
const axios = require('axios');
const fs = require('node:fs');
const path = require('node:path');

//  Load in data
//      - Load config for bot
const optionFile = require('./data/options_dev');
const options = optionFile.content();
//      - Define Timers
const timerFile = require('./data/timers');
const timers = timerFile.content();
//      - Define configuration options
// const shoutoutFile = require('./data/shoutouts');
// const shoutouts = shoutoutFile.content();

// Check for resets, handle timers
const extArgs = process.argv.slice(2);
if (Object.keys(extArgs).length !== 0) {
	if (extArgs[0] === 'reset') {
		// Handle Reset
		const handleReset = new Promise((resolve) => {
			axios.get(options.baseUrl + 'insert/uptime')
				.then(() => {
					axios.get(options.baseUrl + 'insert/guesses?reset')
						.then(() => {
							axios.get(options.baseUrl + 'insert/count?reset')
								.then(() => {
									resolve();
								});
						});
				});
		});

		handleReset.then(() => {
			handleTimers(timers);
		});
	}
}
else {
	handleTimers(timers);
}

// Connect to Twitch:
const client = new tmi.client(options);
client.connect().catch(console.error);

// Register our event handlers (defined below)
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
client.on('join', onJoinHandler);

// Chat catchers
client.on('cheer', onCheerHandler);
client.on('sub', onSubHandler);
client.on('subgift', onSubGiftHandler);
client.on('anonsubgift', onAnonSubGiftHandler);
client.on('submysterygift', onSubMysteryGiftHandler);
client.on('anonsubmysterygift', onAnonSubMysteryGiftHandler);
client.on('raided', onRaidedHandler);

// Add optional things to client
client.extras = [];
client.extras.race = [];

// Chat commands?
client.commands = new Array();
const foldersPath = path.join(__dirname, 'chat-commands');
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

let last_message = null;
function onMessageHandler(channel, tags, message, self) {

	last_message = message;

	if (self) { return; }
	const commandName = message.trim();

	const perms = {};
	if ('#' + tags.username == channel) {
		perms.streamer = true;
		perms.mod = true;
	}
	if (tags.mod) { perms.mod = true; }
	if (tags.vip) { perms.vip = true; }
	if (tags.subscriber) { perms.sub = true; }

	// console.groupCollapsed('Message');
	// console.log(message);
	// console.log(tags);
	// console.groupEnd();

	// Timestamp
	const formattedTime = timeConverter(tags['tmi-sent-ts']);

	console.log(formattedTime);
	// console.log(tags);
	console.log(tags.username);
	// console.log(tags['badge-info'].predictions);
	console.log(perms);
	console.log('- - -');

	if (commandName.indexOf('!') == 0) {
		// Split into parts to handle things
		const args = message.split(' ');
		let command = args[0].substring(1).toLowerCase();

		if (command in client.commands) {
			let action = {};

			// Check for alias
			if (client.commands[command].alias) {
				if (client.commands[command].arg) {
					args.splice(1, 0, client.commands[command].arg);
				}
				command = client.commands[command].alias;
			}

			action = client.commands[command].actions.default;
			if (args.length !== 1) {
				if (client.commands[command].actions[args[1]]) {
					action = client.commands[command].actions[args[1]];
				}
				else {
					action = client.commands[command].actions.default;
				}
			}

			if ('enabled' in action) {
				if (!action.enabled) {
					return;
				}
			}

			if ('execute' in action) {

				if (action.perms) {
					if (!perms[action.perms.levels]) {
						client.say(channel, `${tags.username}, ${action.perms.error}`);
						return false;
					}
				}

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
						client.say(channel, `${tags.username}, ${action.args.error}`);
						return false;
					}
				}

				action.execute(args, tags, message, channel, client);
			}
			else if ('say' in action) {

				// Setup output
				let output = action.say;

				if (action.perms !== undefined) {
					if (!perms[action.perms.levels]) {
						client.say(channel, `${action.perms.error}`);
						return false;
					}
				}

				// Probably unused now >.<
				// Handle the action now
				if (action.args) {
					// Find out how many required, start at 2 because !command and first arg
					let count = 2;
					for (const [key] of Object.entries(action.args)) {
						if (action.args[key][0] === 'r') { count++; }
					}
					// Check full length vs required count
					if (args.length < count) {
						console.log('Missed an argument');
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

				client.say(channel, `${output}`);
			}
		}
	}
	else {
		const whaleText = [
			'whale',
			'whales',
			'w h a l e',
			'w h a l e s',
			'w hales',
			'wh ales',
			'wha les',
			'whal es',
			'wal',
			'baleine',
			'samir',
		];
		const whaleMoji = [
			'🐋',
			'🐳',
		];
		const whaleMorse = [
			'.-- .- .-..',
			'.-- .... .- .-.. .',
			'-... .- .-.. . .. -. .',
		];
		const whaleBinary = [
			'01010111 01100001 01101100',
			'01010111 01101000 01100001 01101100 01100101',
			'01000010 01100001 01101100 01100101 01101001 01101110 01100101',
		];
		let whaleCheck = false;
		if (tags.username === 'ecusare') {
			Object.entries(whaleText).forEach(([key, value]) => {
				if (key !== false && commandName.toLowerCase().includes(value)) {
					whaleCheck = 'text';
				}
			});
			Object.entries(whaleMoji).forEach(([key, value]) => {
				if (key !== false && commandName.toLowerCase().includes(value)) {
					whaleCheck = 'emoji';
				}
			});
			Object.entries(whaleMorse).forEach(([key, value]) => {
				if (key !== false && commandName.toLowerCase().includes(value)) {
					whaleCheck = 'morse';
				}
			});
			Object.entries(whaleBinary).forEach(([key, value]) => {
				if (key !== false && commandName.toLowerCase().includes(value)) {
					whaleCheck = 'binary';
				}
			});
		}
		if (whaleCheck) {
			let response = '';
			switch (whaleCheck) {
			case 'text':
				response = 'you\'re a dingus.';
				break;
			case 'emoji':
				response = '🚫🐋‼️';
				break;
			case 'morse':
				response = '-.-- --- ..- .----. .-. . / .- / -.. .. -. --. ..- ...';
				break;
			case 'binary':
				response = '01111001 01101111 01110101 00100111 01110010 01100101 00100000 01100001 00100000 01100100 01101001 01101110 01100111 01110101 01110011';
				break;
			default:
				break;
			}
			client.say(channel, 'Hey @ecusare, ' + response);
		}

		if (commandName.toLowerCase().indexOf(' comfy ') !== -1) {
			client.say(channel, `Hey ${tags.username}, you misspelled that.`);
		}

		const twitchData = { 'id': tags['user-id'], 'username': tags.username };
		axios.get(options.baseUrl + 'insert/user_reference/?twitch=' + encodeURIComponent(JSON.stringify(twitchData))).catch(console.error);
	}

	// Update coin_log
	axios.post(options.baseUrl + 'coins_fix');
}

function onCheerHandler(channel, tags, message) {
	console.log('caught cheer');
	console.log(tags);
	console.log(message);
}

function onRaidedHandler(channel, username, viewers, tags) {
	const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

	client.say(channel, `Holy cocoa and blankies, ${username} is raiding with ${viewers} ${(viewers > 1 ? 'viewers' : 'viewer')}!`)
		.then(() => {
			// Handle raid hat?
			if (viewers >= 1) {
				let content = '';
				const amount = 160;
				const reason = 'AUTO RAID HAT!';
				axios.get(baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&twitch_id=' + tags['user-id'] + '&amount=' + amount + '&reason=' + reason)
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `WOOOO! Thanks for the raid @${username}, we added ${amount} KomfyCoins to your wallet!`;
						}
						else if (output.status === 'failure') {
							if (output.err_msg === 'no_twitch_id') {
								content = 'That username doesn\'t seem to be in our system.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
						axios.post(baseUrl + 'coins_fix');
					});
			}
			// setTimeout(() => {
			// 	client.say(channel, 'Just a reminder to refresh the stream so that twitch counts the views!');
			// }, 10000);
		});
	console.log('caught raid');
	console.log(username);
	console.log(viewers);
	console.log(tags);
}

function onSubHandler(channel, username, methods, message, tags) {
	console.log('caught subgift');
	console.log(username);
	console.log(methods);
	console.log(message);
	console.log(tags);
}

function onSubGiftHandler(channel, username, streakMonths, recipient, methods, tags) {
	console.log('caught subgift');
	console.log(username);
	console.log(streakMonths);
	console.log(recipient);
	console.log(methods);
	console.log(tags);
}

function onAnonSubGiftHandler(channel, streakMonths, recipient, methods, tags) {
	console.log('caught subgift');
	console.log(streakMonths);
	console.log(recipient);
	console.log(methods);
	console.log(tags);
}

function onSubMysteryGiftHandler(channel, username, giftSubCount, methods, tags) {
	console.log('caught submysterygift');
	console.log(username);
	console.log(giftSubCount);
	console.log(methods);
	console.log(tags);
}

function onAnonSubMysteryGiftHandler(channel, giftSubCount, methods, tags) {
	console.log('caught anonsubmysterygift');
	console.log(giftSubCount);
	console.log(methods);
	console.log(tags);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}

function onJoinHandler(channel, username, isSelf) {
	if (isSelf) {
		if (channel === '#komfykiwi') {
			// client.say('komfykiwi', 'I\'m here boss! Got my cocoa and blankie!');
		}
	}
}

// Extra functions
function timeConverter(UNIX_timestamp) {
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
}

function handleTimers() {
	let timerOffset = 1;
	axios.get(options.baseUrl + 'retrieve/uptime')
		.then(function(response) {
			if (response.data.status === 'success') {
				timerOffset = (response.data.minutes > 0 ? response.data.minutes : 1);
			}
		})
		.catch(console.error)
		.finally(() => {
			const queue = {};
			setInterval(
				function() {
					console.log('Timer: ' + timerOffset);
					Object.entries(timers).forEach(([key]) => {
						if ((timerOffset % timers[key]['timer']) == 0) {
							if (isObjectEmpty(queue)) {
								queue[key] = timers[key];
							}
							else {
								const first = Object.keys(queue)[0];
								delete queue[first];
								queue[key] = timers[key];
							}
						}
					});
					if (!isObjectEmpty(queue)) {
						const key = Object.keys(queue)[0];
						if (last_message !== queue[key]['message']) {
							console.log('Timer: ' + key);
							liveCheck('kittenangie').then(res => {
								if (res === true) {
									console.log('Timer: SENT');
									client.say(queue[key]['channel'], queue[key]['message'])
										.then(delete queue[key]);
								}
								else {
									console.log('Timer: SKIPPED - not live');
								}
							});
						}
						delete queue[key];
					}
					timerOffset++;
				},
				60000,
			);
		});
}

function liveCheck(channel) {
	const chan = channel.toLowerCase();
	return axios.get('https://www.kittenangie.com/bots/api/v1/live_check/insert')
		.then(function(response) {
			const data = response.data;
			// eslint-disable-next-line
			if (data.response.hasOwnProperty(chan)) {
				return true;
			}
			else {
				return false;
			}
		});
}

const isObjectEmpty = (objectName) => {
	return Object.keys(objectName).length === 0 && objectName.constructor === Object;
};