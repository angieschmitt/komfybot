const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'coins',
	channel: ['komfykiwi', 'komfybot'],
	help: 'Shows your (or someone else\'s) total coin amount! Additional arguments: add, store, buy',
	aliases: {
		'coin': {
			arg: false,
			list: false,
		},
		'store': {
			arg: 'store',
			list: false,
		},
	},
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

				axios.get(data.settings.baseUrl + url)
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
						axios.post(data.settings.baseUrl + 'coins_fix');
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

				axios.get(data.settings.baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + amount + '&reason=' + reason)
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `Congrats @${username} on adding ${amount} KomfyCoins to your wallet.`;
						}
						else if (output.status === 'failure') {
							if (output.err_msg === 'no_twitch_id') {
								content = 'That username doesn\'t seem to be in our system.';
							}
							else if (output.err_msg === 'not_enough_coins') {
								content = 'That would put you into the negatives.';
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
						if ('silent' in tags) {
							if (tags.silent !== true) {
								client.say(channel, content);
							}
						}
						else {
							client.say(channel, content);
						}
						axios.post(data.settings.baseUrl + 'coins_fix');
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
				const amount = Math.abs(args[2]);
				const username = tags.username;
				let reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').trim();
				reason = `SPENT: ${reason}`;

				axios.get(data.settings.baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + (amount * -1) + '&reason=' + reason)
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
				axios.get(data.settings.baseUrl + 'retrieve/store')
					.then(function(response) {
						const resData = response.data;

						content += 'Here\'s whats in the store:';
						resData.content.forEach(element => {
							content += ' ' + element['name'] + ' @ ' + element['value'] + ' KomfyCoins ||';
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

				axios.get(data.settings.baseUrl + 'retrieve/store/?item=' + item.toLowerCase())
					.then(function(response) {
						const resData = response.data;

						if (resData.status === 'failure') {
							content += `No item named ${item}, or that item isn't available`;
						}
						else {
							const cost = resData.content;
							const reason = 'BOUGHT: ' + item;

							axios.get(data.settings.baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + (cost * -1) + '&reason=' + reason)
								.then(function(response2) {
									const resData2 = response2.data;
									if (resData2.status === 'success') {
										// Random Hat catch!
										if (item.toLowerCase() === 'random hat') {
											axios.get(data.settings.baseUrl + 'interactive/hats/hat_random?user=' + userID)
												.then(function(response3) {
													const resData3 = response3.data;
													if (resData3.status === 'success') {
														let rarityText = '';
														switch (resData3.content.rarity) {
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
														if (parseInt(resData3.content.qty) <= 1) {
															content += ` You unwrapped a ${resData3.content.item} (${rarityText}) !`;
														}
														else {
															content += ` You unwrapped another ${resData3.content.item} (${rarityText}) !`;
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
													axios.post(data.settings.baseUrl + 'coins_fix');
												});
										}
										else {
											axios.get(data.settings.baseUrl + 'interactive/coins/store_purchase?twitch_id=' + userID + '&item=' + item)
												.then(function(response4) {
													const resData4 = response4.data;
													if (resData4.status === 'success') {
														if (resData4.content.qty == 1) {
															content = `Congrats @${username} on buying a ${item} @ ${cost} KomfyCoins.`;
														}
														else {
															content = `Congrats @${username} on buying another ${item} @ ${cost} KomfyCoins. You currently have ${resData4.content.qty}.`;
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
													axios.post(data.settings.baseUrl + 'coins_fix');
												});
										}
									}
									else if (resData2.status === 'failure' && resData2.err_msg === 'not_enough_coins') {
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
									axios.post(data.settings.baseUrl + 'coins_fix');
								});
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
						axios.post(data.settings.baseUrl + 'coins_fix');
					});
			},
		},
		inv: {
			execute(args, tags, message, channel, client) {
				let content = '';

				const url = 'interactive/coins/store_inventory/?twitch_id=' + tags['user-id'];
				axios.get(data.settings.baseUrl + url)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if (Object.keys(resData.content).length) {
								content += 'Here\'s whats in your inventory: ';
								// eslint-disable-next-line
								Object.entries(resData.content).forEach(([key, value]) => {
									content += `${value['qty']}x ${value['name']}, `;
								});
								content = content.substring(0, content.length - 2);
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'no_twitch_id') {
								content = 'That username doesn\'t seem to be in our system.';
							}
							else if (resData.err_msg === 'no_items') {
								content = 'Seems like you don\'t have anything in your inventory.';
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
		coincount: {
			async execute(tags) {
				let coinCount = false;

				const p1 = new Promise((resolve) => {
					axios.get(data.settings.baseUrl + 'retrieve/coins/?twitch_id=' + tags['user-id'])
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								coinCount = (output.total ? output.total : 0);
							}
						})
						.catch(err => console.log(err))
						.finally(function() {
							resolve(coinCount);
						});
				});

				const results = await p1;
				return results;
			},
		},
	},
};