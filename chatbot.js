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

		// Connect to Twitch:
		client.connect();

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
			// console.log(tags.username + '->' + channel );
			// console.groupEnd();

			console.log(tags.username);
			console.log(perms);
			console.log('- - -');

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
				if (commandName === '!kiwiquote') {
					let content = '';
					axios.get('https://kittenangie.com/bots/api/endpoint.php?request=quote')
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
				if (commandName === '!kiwipun') {
					let content = '';
					axios.get('https://kittenangie.com/bots/api/endpoint.php?request=pun')
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
				if (commandName.indexOf('!kiwi8') === 0) {
					let content = '';
					axios.get('https://kittenangie.com/bots/api/endpoint.php?request=8ball')
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

				// Interactive
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
						client.say(channel, 'Valid commands | MODS: !coins add <user> <amt> <reason:optional> | USERS: !coins amt <username:optional>');
						return;
					}

					let username = '';
					// Clean for DB
					if (args[2]) {
						if (args[2].indexOf('@') === 0) {
							username = args[2].substring(1);
						}
						else {
							username = args[2];
						}
					}
					else {
						username = tags.username;
					}

					if (args[1] === 'add') {
						if (perms.mod) {

							let amount = 0;
							let amtCheck = false;
							let userCheck = false;
							if (args[2]) {
								userCheck = true;
							}
							if (args[3]) {
								amtCheck = true;
								amount = args[3];
							}
							const reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();

							if (userCheck) {
								if (amtCheck) {
									axios.get('https://www.kittenangie.com/bots/api_new/insert/coins.php?username=' + username + '&amount=' + amount + '&reason=' + reason)
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
					if (args[1] === 'amt') {
						axios.get('https://www.kittenangie.com/bots/api_new/retrieve/coins.php?username=' + username)
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
							})
							.catch(function() {
								content = 'Something went wrong, tell @kittenAngie.';
							})
							.finally(function() {
								client.say(channel, content);
							});
					}
				}
			}
		}

		const timers = {
			'discord': {
				'channel': 'komfykiwi',
				'timer': 30,
				'message': 'Come join us on Discord: https://discord.gg/3YZrUHypk9',
			},
		};
		const timerList = [];
		Object.entries(timers).forEach(([key]) => {
			const interval = (timers[key]['timer'] * 60 * 1000);
			timerList[key] = setInterval(
				function() {
					console.log(interval + '->' + timers[key]['message']);
					if (last_message !== timers[key]['message']) {
						client.say(timers[key]['channel'], timers[key]['message']);
					}
					else {
						console.log(`skipped ${key} timer`);
					}
				},
				parseInt(interval),
			);
		});

		// Called every time the bot connects to Twitch chat
		function onConnectedHandler(addr, port) {
			console.log(`* Connected to ${addr}:${port}`);
		}
	});