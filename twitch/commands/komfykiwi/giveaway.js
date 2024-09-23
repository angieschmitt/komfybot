const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: 'giveaway',
	help: 'Command to interact with the giveaway. Additional arguments: start, end ',
	channel: ['komfykiwi', 'komfybot'],
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
				axios.get(data.settings.newUrl + 'giveaway/update/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const output = response.data;

						console.log(output);

						// Only output on failure
						if (output.status === 'failure') {
							if (output.err_msg == 'no_giveaway_exists') {
								content = `@${tags['username']}, seems like there isn't a giveaway running right now.`;
							}
							else if (output.err_msg == 'already_entered') {
								content = `@${tags['username']}, seems like you've already entered this giveaway!`;
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
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

				const twitchData = { 'ident_type':'twitch_username', 'ident':channel.replace('#', ''), 'value':value };

				let content = '';
				axios.get(data.settings.newUrl + 'giveaway/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `Giveaway started! Do !giveaway to enter for your chance to win ${value} KomfyCoins!`;
						}
						else if (output.status === 'failure') {
							if (output.err_msg == 'giveaway_exists') {
								content = 'Seems like there is already a giveaway running.';
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

				const twitchData = { 'ident_type':'twitch_username', 'ident':channel.replace('#', ''), 'action':'end' };

				let content = '';
				axios.get(data.settings.newUrl + 'giveaway/update/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const output = response.data;

						console.log(output);

						if (output.status === 'success') {
							content = `Giveaway ended! The winner is @${output.response}, netting ${output.value} KomfyCoins!`;

							const args2 = ['!coins', 'add', output.response, output.value, 'Giveaway' ];
							const message2 = `!coins add ${output.response} ${output.value} Giveaway`;
							tags['silent'] = true;
							client.commands.komfykiwi.coins.actions.add.execute(args2, tags, message2, channel, client);
						}
						else if (output.status === 'failure') {
							if (output.err_msg == 'no_giveaway_exists') {
								content = 'Seems like there is not a giveaway running.';
							}
							else if (output.err_msg == 'not_enough_entrees') {
								content = 'Giveaway ended, but it seems like there weren\'t enough entrees to choose a winner.';
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
				axios.get(data.settings.newUrl + 'giveaway/retrieve/' + channelName)
					.then(function(response) {
						const output = response.data;

						console.log(output);

						if (output.status === 'success') {
							const list = JSON.parse(output.response);
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
						else if (output.status === 'failure') {
							if (output.err_msg == 'no_giveaway_exists') {
								content = 'Seems like there is not a giveaway running.';
							}
							else if (output.err_msg == 'no_entrees_exists') {
								content = 'There are currently no entrees in the giveaway.';
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
};