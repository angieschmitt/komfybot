const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'wos',
	help: 'Command to reward WoS players. Additional arguments: start, end',
	aliases: {
	},
	actions: {
		default: {
			help: 'MOD command to prompt WoS payouts. !wos <username:required> <username:required> <username:required> etc',
			perms: {
				levels: ['streamer', 'mod'],
				error: 'is doing something they shouldn\'t be doing!',
			},
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the user(s)',
			},
			execute(args, tags, message, channel, client) {

				const channelName = channel.replace('#', '');
				const currencyEnabled = module.exports.currencyCheck(channelName, client);

				// Timeout
				const timeout = 1000;

				// Strip out bad users
				const users = message.replace(args[0] + ' ', '').split('@');
				users.forEach((user, idx) => {
					if (user == '') {
						users.splice(idx, 1);
					}
				});

				if (currencyEnabled) {
					const payout = [ 200, 160, 100, 80 ];

					let iter = 0;
					const processUsers = setInterval(
						(users) => {
							let content = '';
							client.commands['global'].wos.actions.submitCoins.execute(users[iter].trim(), payout[iter])
								.then((response) => {
									if (response[0]) {
										content = `@${response[1]}, thanks for playing WoS, enjoy your ${response[2]} Komfycoins!`;
									}
									else {
										content = `@${response[1]}, tell Kiwi she owes you ${response[2]} coins.`;
									}
								})
								.catch(err => console.log(err))
								.finally(function() {
									client.say(channel, content);
								});

							iter = iter + 1;

							if (iter == users.length) {
								clearInterval(processUsers);
							}
						},
						timeout, users,
					);
				}
				else {
					let iter = 0;
					const processUsers = setInterval(
						(users) => {
							client.say(channel, `${users[iter].trim()}, thanks for participating!`);
							iter = iter + 1;

							if (iter == users.length) {
								clearInterval(processUsers);
							}
						},
						timeout, users,
					);
				}
			},
		},
		submitCoins: {
			async execute(user, payout) {

				let processed = false;

				const p1 = new Promise((resolve) => {
					const reason = 'WoS';
					axios.get(data.settings.baseUrl + 'insert/coins/?username=' + user.toLowerCase() + '&amount=' + payout + '&reason=' + reason)
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								processed = [true, user, payout];
							}
							else if (output.status === 'failure') {
								processed = [false, user, payout];
							}
						})
						.catch(function() {
							processed = [false, user, payout];
						})
						.finally(function() {
							resolve(processed);
						});
				});

				const results = await p1;
				return results;
			},
		},
	},
	currencyCheck(channel, client) {
		let currencyEnabled = false;
		if ('currency_enabled' in client.settings[channel]) {
			if (client.settings[channel]['currency_enabled'] == 'on') {
				currencyEnabled = true;
			}
			else if (client.settings[channel]['currency_enabled'] == true) {
				currencyEnabled = true;
			}
		}
		return currencyEnabled;
	},
	currencyHandler(value, channel, client) {
		let currencyOut = false;
		if (value > 1) {
			if ('currency_name_plural' in client.settings[channel]) {
				currencyOut = client.settings[channel].currency_name_plural;
			}
			else {
				currencyOut = 'Coins';
			}
		}
		else if (value == 1) {
			if ('currency_name_single' in client.settings[channel]) {
				currencyOut = client.settings[channel].currency_name_single;
			}
			else {
				currencyOut = 'Coin';
			}
		}
		return currencyOut;
	},
};