const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'coins',
	description: 'Handles coin commands',
	help: 'Shows your (or someone else\'s) total coin amount! Additional arguments: add, store, buy',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';

				let url = 'retrieve/coins/';
				if (args.length > 1 && args[1] !== tags.username) {
					url += '?username=' + args[1].replace('@', '');
				}
				else {
					url += '?twitch_id=' + tags['user-id'];
				}

				axios.get(baseUrl + url)
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							if (args.length > 1) {
								content = `Hey @${tags.username}, ${args[1].replace('@', '')} has ${(output.total ? output.total : 0)} KomfyCoins stashed in their wallet!`;
							}
							else {
								content = `Hey @${tags.username}, you have ${(output.total ? output.total : 0)} KomfyCoins stashed in your wallet!`;
							}
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
				const reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();

				axios.get(baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + amount + '&reason=' + reason)
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `Congrats @${username} on adding ${amount} KomfyCoins to your wallet.`;
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
		store: {
			help: 'Lists out items available in the KomfyStore. !coins store',
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'retrieve/store')
					.then(function(response) {
						const data = response.data;

						content += 'Here\'s whats in the store:';
						data.content.forEach(element => {
							content += ' ' + element[1] + ' @ ' + element[2] + ' KomfyCoins ||';
						});
						content = content.substring(0, content.length - 3);

					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
		buy: {
			help: 'Buy an item from the KomfyStore. !coins buy <item-name:required>',
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the item you are purchasing!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];
				const username = tags.username;
				const item = message.replace(args[0], '').replace(args[1], '').trim();

				axios.get(baseUrl + 'retrieve/store/?item=' + item.toLowerCase())
					.then(function(response) {
						const data = response.data;

						if (data.status === 'failure') {
							content += `No item named ${item}`;
						}
						else {
							const cost = data.content;
							const reason = 'BOUGHT: ' + item;

							axios.get(baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + (cost * -1) + '&reason=' + reason)
								.then(function(response2) {
									const output = response2.data;
									if (output.status === 'success') {
										// Random Hat catch!
										if (item.toLowerCase() === 'random hat') {
											axios.get(baseUrl + 'interactive/hats/hat_random?user=' + userID)
												.then(function(response3) {
													const output3 = response3.data;
													if (output3.status === 'success') {
														let rarityText = '';
														switch (output3.content.rarity) {
														case '1':
															rarityText = 'Common';
															break;
														case '2':
															rarityText = 'Uncommon';
															break;
														case '3':
															rarityText = 'RARE';
															break;
														default:
															break;
														}
														content = `Congrats @${username} on buying a ${item} @ ${cost} KomfyCoins.`;
														if (parseInt(output3.content.qty) <= 1) {
															content += ` You unwrapped a ${output3.content.item} (${rarityText}) !`;
														}
														else {
															content += ` You unwrapped another ${output3.content.item} (${rarityText}) !`;
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
										else {
											content = `Congrats @${username} on buying a ${item} @ ${cost} KomfyCoins.`;
										}
									}
									else if (output.status === 'failure' && output.err_msg === 'not_enough_coins') {
										content = 'You seem to be out of KomfyCoins.';
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
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
						axios.post(baseUrl + 'coins_fix');
					});
			},
		},
	},
};