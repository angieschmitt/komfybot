const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'giveaway',
	help: 'Command to interact with the giveaway. Additional arguments: start, end',
	aliases: {
		'g': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				const twitchData = { 'ident_type':'twitch_username', 'ident':channel.replace('#', ''), 'action':'join', 'username':tags['username'] };

				let content = '';
				axios.get(data.settings.finalUrl + 'giveaway/update/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;

						// Only output on failure
						if (resData.status === 'failure') {
							if (resData.err_msg == 'no_giveaway_exists') {
								content = `@${tags['username']}, seems like there isn't a giveaway running right now.`;
							}
							else if (resData.err_msg == 'already_entered') {
								content = `@${tags['username']}, seems like you've already entered this giveaway!`;
							}
							else if (resData.status === 'failure') {
								if (resData.err_msg === 'missing_authorization') {
									content = 'Authorization issue. Tell @kittenAngie.';
								}
								else {
									content = 'Something went wrong, tell @kittenAngie.';
								}
							}
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, content);
						}
					});
			},
		},
		start: {
			help: 'MOD command to start a giveaway. !giveaway start <amount:optional:default(100)>',
			perms: {
				levels: ['streamer', 'mod'],
				error: 'This is a mod+ only command',
			},
			execute(args, tags, message, channel, client) {

				let value = false;
				if (args[2]) {
					if (!isNaN(parseInt(args[2]))) {
						value = parseInt(args[2]);
					}
				}
				else {
					value = 100;
				}

				const channelName = channel.replace('#', '');
				const twitchData = { 'ident_type':'twitch_username', 'ident':channelName, 'value':value };
				const currencyOut = module.exports.currencyHandler(value, channelName, client);

				let content = '';
				axios.get(data.settings.finalUrl + 'giveaway/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `Giveaway started! Do !giveaway to enter for your chance to win ${value} ${currencyOut}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'giveaway_exists') {
								content = 'Seems like there is already a giveaway running.';
							}
							else if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
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
			},
		},
		end: {
			help: 'MOD command to end a giveaway. !giveaway end',
			perms: {
				levels: ['streamer', 'mod'],
				error: 'This is a mod+ only command',
			},
			execute(args, tags, message, channel, client) {

				const channelName = channel.replace('#', '');
				const twitchData = { 'ident_type':'twitch_username', 'ident':channelName, 'action':'end' };
				const currencyEnabled = module.exports.currencyCheck(channelName, client);

				let content = '';
				axios.get(data.settings.finalUrl + 'giveaway/update/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;

						if (resData.status === 'success') {
							const currencyOut = module.exports.currencyHandler(resData.value, channelName, client);

							content = `Giveaway ended! The winner is @${resData.response}, netting ${resData.value} ${currencyOut}!`;

							if (currencyEnabled) {
								const args2 = ['!coins', 'add', resData.response, resData.value, 'Giveaway' ];
								const message2 = `!coins add ${resData.response} ${resData.value} Giveaway`;
								tags['silent'] = true;
								client.commands.komfykiwi.coins.actions.add.execute(args2, tags, message2, channel, client);
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'no_giveaway_exists') {
								content = 'Seems like there is not a giveaway running.';
							}
							else if (resData.err_msg == 'not_enough_entrees') {
								content = 'Giveaway ended, but it seems like there weren\'t enough entrees to choose a winner.';
							}
							else if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
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
			},
		},
		list: {
			help: 'MOD command to list out entries in a giveaway. !giveaway list',
			perms: {
				levels: ['streamer', 'mod'],
				error: 'This is a mod+ only command',
			},
			execute(args, tags, message, channel, client) {
				const channelName = channel.replace('#', '');

				let content = '';
				axios.get(data.settings.finalUrl + 'giveaway/retrieve/' + channelName)
					.then(function(response) {
						const resData = response.data;

						if (resData.status === 'success') {
							const list = JSON.parse(resData.response);
							if (Object.keys(list).length) {
								content = 'Current entrees: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(list).forEach(([key, value]) => {
									content += `@${value} || `;
								});
								content = content.substring(0, (content.length - 3));
							}
							else {
								content = 'Seems like there aren\'t any guesses!';
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'no_giveaway_exists') {
								content = 'Seems like there is not a giveaway running.';
							}
							else if (resData.err_msg == 'no_entrees_exists') {
								content = 'There are currently no entrees in the giveaway.';
							}
							else if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
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