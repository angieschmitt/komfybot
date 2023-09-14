const tmi = require('tmi.js');
const axios = require('axios');
const fs = require('node:fs');
const path = require('node:path');
const { setTimeout } = require('node:timers/promises');

// Define configuration options
const opts = {
	identity: {
		username: 'komfybot',
	},
	channels: [
		'komfykiwi',
		// 'kittenangie',
		// 'alazysun',
	],
	options: {
		// debug: true,
	},
	connection: {
		reconnect: true,
	},
};

axios.get('https://www.kittenangie.com/bots/api/get_key.php')
	.then(function(response) {
		opts.identity.password = response.data.key;
	})
	.then(function() {
		// Create a client with our options
		const client = new tmi.client(opts);

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

		// Connect to Twitch:
		client.connect().catch(console.error);

		// Add optional things to client
		client.extras = [];
		client.extras.count = 0;
		client.extras.race = '';

		// Chat commands?
		client.commands = new Array();
		const foldersPath = path.join(__dirname, 'chat-commands');
		const commandFolders = fs.readdirSync(foldersPath);

		for (const folder of commandFolders) {
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);
				client.commands[command.name] = command;
			}
		}

		let last_message = null;
		// Called every time the bot connects to Twitch chat
		function onMessageHandler(channel, tags, message, self) {

			last_message = message;

			if (self) { return; }
			const commandName = message.trim();

			const perms = {};
			if ('#' + tags.username == channel) { perms.mod = true; }
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
			console.log(tags.username);
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
		}

		function onCheerHandler(channel, tags, message) {
			console.log('caught cheer');
			console.log(tags);
			console.log(message);
		}

		function onRaidedHandler(channel, username, viewers, tags) {
			client.say(channel, `Holy cocoa and blankies, ${username} is raiding with ${viewers} ${(viewers > 1 ? 'viewers' : 'viewer')}!`)
				.then(() => {
					setTimeout(() => {
						client.say(channel, 'Just a reminder to refresh the stream so that twitch counts the views!');
					}, 10000);
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

		// Timers
		const timers = {
			'subtember': {
				'channel': 'komfykiwi',
				'timer': 40,
				// 'message': 'It\'s SUBtember on Twitch, so make sure you check out the !subtember and !subotage commands!',
				'message': 'WOOHOO IT\'S SUBtember! This year Twitch is offering 20% - 30% discounts on subs! That also includes gifties and upgrades... if you know someone who would LOVE a sub, nows the time to help them (or you) join the KomfyKrew!',
			},
			'discord': {
				'channel': 'komfykiwi',
				'timer': 30,
				'message': 'Come hang with the KomfyKrew on Discord: https://discord.gg/8T44G4mUFu',
			},
			'socials': {
				'channel': 'komfykiwi',
				'timer': 120,
				'message': 'Yo, wanna see more komfyness? I would highly appreciate you checking out all my socials and maybe dropping a follow! There is an easy overview list right here: https://komfykiwi.com/socials',
			},
			'appreciate': {
				'channel': 'komfykiwi',
				'timer': 200,
				'message': 'Hey, just letting YOU know, that you matter & that you’re appreciated! You deserve to have great things, and it is totally okay to feel exhausted sometimes. You ARE beautiful, and I am SOO happy that you’re here - thank you! Also, ya know, nice butt. ♡',
			},
			'tipsandbits': {
				'channel': 'komfykiwi',
				'timer': 240,
				'message': 'Don’t mind me, just humbly reminding you all that Kiwi is trying to make streaming her full time gig! So if you can swing it, she’d highly appreciate any form of support, be it a Twitch Subscription, a Tip or some Bits. No contribution is ever required or expected, but always comes with her never ending, deepest gratitude! Why not gift a Sub to a fren? :3 Or use your Amazon Prime? All the funds go to improving the stream, as well as bills. Remember to always spend responsibly! THANK YOU! ♡',
			},
		};
		let minutes = 1;
		const queue = {};
		setInterval(
			function() {
				console.log('Timer: ' + minutes);
				Object.entries(timers).forEach(([key]) => {
					if ((minutes % timers[key]['timer']) == 0) {
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
						client.say(queue[key]['channel'], queue[key]['message'])
							.then(delete queue[key]);
					}
					delete queue[key];
				}
				minutes++;
			},
			60000,
		);

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

	});

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

const isObjectEmpty = (objectName) => {
	return Object.keys(objectName).length === 0 && objectName.constructor === Object;
};