const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'coins',
	description: 'Handles coin commands',
	help: 'Shows your (or someone else\'s) total coin amount! Additional arguments: add',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';

				let username = tags.username;
				if (args[1] !== tags.username) {
					username = args[1];
				}
				axios.get(baseUrl + 'retrieve/coins/?username=' + username)
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							if (args[1] !== tags.username) {
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
						client.say(channel, `${content}`);
					});
			},
		},
		add: {
			help: 'MOD command that allows adding coins to a wallet. !coins add <username:required> <amt:required> <reason:optional>',
			perms: {
				levels: ['mod'],
				error: 'is trying to cheat!',
			},
			args: {
				1: [ 'r' ],
				2: [ 'r' ],
				3: [ 'o' ],
				error: 'don\'t forgot the user or the amount!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const username = args[2].replace('@', '');
				const amount = args[3];
				let reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();

				// REMOVE AFTER TESTING
				if (reason == '') {
					reason = 'testing';
				}

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
			},
		},
		spend: {
			help: 'Allows spending coins. !coins spend <amt:required> <reason:optional>',
			args: {
				1: [ 'r' ],
				2: [ 'o' ],
				error: 'don\'t forget the amount!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const amount = args[2];
				const username = tags.username;
				let reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').trim();

				// REMOVE AFTER TESTING
				if (reason == '') {
					reason = 'testing';
				}
				reason = `SPENT: ${reason}`;

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
			},
		},
	},
};