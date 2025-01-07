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

				const payout = [ 160, 120, 80, 40 ];

				let iter = 0;
				const users = message.replace(args[0] + ' ', '').split('@');
				users.forEach((user) => {
					if (user !== '') {
						if (currencyEnabled) {
							if (payout[iter] === undefined) {
								payout[iter] = 40;
							}
							const args2 = ['!coins', 'add', '@' + user, payout[iter], 'WoS' ];
							const message2 = `!coins add @${user} ${payout[iter]} WoS`;
							// tags['silent'] = true;
							client.commands.komfykiwi.coins.actions.add.execute(args2, tags, message2, channel, client);
							iter++;
						}
					}
				});
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