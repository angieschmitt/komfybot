const tmi = require('tmi.js');
const axios = require('axios');

// Define configuration options
const opts = {
	identity: {
		username: 'komfybot',
	},
	channels: [
		'komfykiwi',
		'kittenangie',
		// 'alazysun',
	],
	options: {
		// debug: true,
	},
	connection: {
		reconnect: true,
	},
};

let optionals = 0;

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

		// Connect to Twitch:
		client.connect().catch(console.error);

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

			const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

			if (commandName.indexOf('!') == 0) {
				if (commandName === '!banana') {
					if (tags.username === 'kittenangie') {
					// if (perms.mod) {
						client.say(channel, '🍌🍌🍌🍌🍌🍌🍌');
					}
				}
				if (commandName === '!potato') {
					if (tags.username === 'kittenangie') {
						// if (perms.mod) {
						client.say(channel, '🥔🥔🥔🥔🥔🥔🥔');
					}
				}
				if (commandName.indexOf('!discord') === 0) {
					client.say(channel, 'Come join us on Discord: https://discord.gg/3YZrUHypk9');
				}
				if (commandName === '!quote') {
					let content = '';
					axios.get(baseUrl + 'retrieve/quote/')
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								content = 'Kiwi once said... ' + output.content;
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
						});
				}
				if (commandName === '!pun') {
					let content = '';
					axios.get(baseUrl + 'retrieve/pun/')
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								content = 'Pun Delivery Service: ' + output.content;
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
						});
				}
				if (commandName === '!flirt') {
					let content = '';
					axios.get(baseUrl + 'retrieve/pickup/')
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								content = output.content;
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
						});
				}
				if (commandName.indexOf('!8ball') === 0) {
					let content = '';
					axios.get(baseUrl + 'retrieve/8ball/')
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								content = `@${tags.username} the Magic 8 Ball says... ` + output.content;
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
						});
				}
				if (commandName.indexOf('!fotd') === 0) {
					let content = '';
					axios.get(baseUrl + 'retrieve/fact/')
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								content = `@${tags.username} the Fact of the Day is... ` + output.content;
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
						});
				}

				// Interactive
				if (commandName.indexOf('!optional') === 0) {
					let content = '';
					const args = message.split(' ');

					if (perms.mod) {
						if (args[1] && args[1] == 'reset') {
							optionals = 0;
							content = 'Optional counter reset';
						}
						else {
							optionals++;
							content = 'OPTIONAL COUNTER: ' + optionals;
						}
						client.say(channel, content);
					}
				}
				if (commandName.indexOf('!so') === 0) {
					let content = '';
					const args = message.split(' ');

					if (!args[1]) {
						client.say(channel, 'Valid commands | MODS: !so <user> <message:optional>');
						return;
					}

					let username = '';
					// Clean for DB
					if (args[1]) {
						if (args[1].indexOf('@') === 0) {
							username = args[1].substring(1);
						}
						else {
							username = args[1];
						}
					}
					else {
						username = tags.username;
					}

					if (perms.mod) {
						content = `Go check out @${username} at https://www.twitch.tv/${username}!`;
						if (args[2]) {
							const messageOut = message.replace(args[0], '').replace(args[1], '').trim();
							content += ' ' + messageOut;
						}
						client.say(channel, content);
					}
				}
				if (commandName.indexOf('!coins') === 0) {
					let content = '';
					const args = message.split(' ');

					if (!args[1]) {
						client.say(channel, 'Valid commands | MODS: !coins add <user> <amt> <reason:optional> | USERS: !coins amt <username:optional>, !coins spend <amt> <reason:optiona');
						return;
					}

					if (args[1] === 'add') {
						if (perms.mod) {

							let amount = 0;
							let amtCheck = false;
							let username = false;
							let userCheck = false;
							if (args[2]) {
								username = args[2].replace('@', '');
								userCheck = true;
							}
							if (args[3]) {
								amtCheck = true;
								amount = args[3];
							}
							const reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();

							if (userCheck) {
								if (amtCheck) {
									axios.get(baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + amount + '&reason=' + reason)
										.then(function(response) {
											const output = response.data;
											if (output.status === 'success') {
												content = `Congrats @${username} on adding ${amount} KomfyCoins to your wallet.`;
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
										});
								}
								else {
									client.say(channel, `Hey @${tags.username}, you forgot to enter an amount.`);
								}
							}
							else {
								client.say(channel, `Hey @${tags.username}, you forgot to enter a username.`);
							}
						}
						else {
							content = `No. Bad ${tags.username}. That's cheating.`;
						}
					}

					if (args[1] === 'spend') {
						let amount = 0;
						let amtCheck = false;
						const username = tags.username;
						if (args[2]) {
							amtCheck = true;
							amount = args[2];
						}
						const reason = 'SPENT: ' + message.replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();

						if (amtCheck) {
							axios.get(baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + (amount * -1) + '&reason=' + reason)
								.then(function(response) {
									const output = response.data;
									if (output.status === 'success') {
										content = `Congrats @${username} on spending ${amount} KomfyCoins.`;
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
								});
						}
						else {
							client.say(channel, `Hey @${tags.username}, you forgot to enter an amount.`);
						}
					}

					if (args[1] === 'amt') {

						let username = false;
						if (args[2]) {
							username = args[2].replace('@', '');
						}
						else {
							username = tags.username;
						}

						axios.get(baseUrl + 'retrieve/coins/?username=' + username)
							.then(function(response) {
								const output = response.data;
								if (output.status === 'success') {

									if (username !== tags.username) {
										content = `Hey @${tags.username}, ${username} has ${(output.total ? output.total : 0)} KomfyCoins stashed in their wallet!`;
									}
									else {
										content = `Hey @${username}, you have ${(output.total ? output.total : 0)} KomfyCoins stashed in your wallet!`;
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
							});
					}

					client.say(channel, content);
				}
				if (commandName.indexOf('!define') === 0) {
					let content = '';
					const args = message.split(' ');

					if (!args[1]) {
						client.say(channel, 'Valid commands | !define <word>');
						return;
					}
					else {
						axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + args[1])
							.then(function(response) {
								const output = response.data;

								content = `@${tags.username}, ${args[1]} can be defined as a... `;
								const meanings = output[0].meanings;
								Object.entries(meanings).forEach(([key]) => {
									content += `${meanings[key].partOfSpeech} : ${meanings[key].definitions[0].definition} || `;
								});

								content = content.substring(0, content.length - 3).trim();

								if (output[0].phonetic) {
									content += ` It is pronounced like: ${output[0].phonetic}`;
								}
							})
							.catch(function(caught) {
								const output = caught.response.data;
								if (output.message == 'Sorry pal, we couldn\'t find definitions for the word you were looking for.') {
									content = `Sorry @${tags.username}, we couldn't find definitions for the word you were looking for.`;
								}
								else {
									content = 'Something went wrong, tell @kittenAngie.';
								}
							})
							.finally(function() {
								client.say(channel, content);
							});
					}
				}

				// Explainers
				if (commandName === '!ads') {
					let content = '';
					content += 'Gotta take an AD Break… Trust me, I get it. It sucks. Sorry! ';
					content += 'I am trying to make this my full time  job so I gotta. ';
					content += 'I appreciate each and everyone that let’s the ADs run, but why not get up, walk around & stretch your legs a bit. ';
					content += 'I’ll be right back! Silver lining: With these ADs in place, we get to not have to deal with even more annoying Pre-Roll ADs, which nobody likes at all.';
					client.say(channel, content);
				}
				if (commandName === '!pkmn') {
					let content = '';
					content += 'In this Randomizer, Pokemon and their movesets are all randomized. ';
					content += 'On top of that, all Key Items have been randomized as well, with the caveat that all Badges are still at Gym Leaders, but shuffled up. ';
					content += 'There is logic baked into it, guaranteeing a game that is still solvable every time. ';
					content += 'The goal is to collect as many key items as necessary and end up beating Red.';
					client.say(channel, content);
				}
			}
		}

		// Timers
		const timers = {
			'discord': {
				'channel': 'komfykiwi',
				'timer': 30,
				'message': 'Come hang with the KomfyKrew on Discord: https://discord.gg/3YZrUHypk9',
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
				// client.say('komfykiwi', 'I\'m here boss! Got my cocoa and blankie!');
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