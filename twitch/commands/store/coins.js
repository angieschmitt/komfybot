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

				const jsonData = {};

				// Setup who we're looking up...
				if (args.length > 1 && args[1] !== tags.username) {
					jsonData['ident_type'] = 'twitch_username';
					jsonData['ident'] = args[1].replace('@', '');
				}
				else {
					jsonData['ident_type'] = 'twitch_id';
					jsonData['ident'] = tags['user-id'];
				}

				// Add the action we are taking...
				jsonData['action'] = 'amt';

				let content = '';
				axios.get(data.settings.finalUrl + 'coins/retrieve/json/' + encodeURIComponent(JSON.stringify(jsonData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if (args.length > 1) {
								content = `Hey @${tags.username}, ${args[1].replace('@', '')} has ${(resData.response ? resData.response : 0)} KomfyCoins stashed in their wallet!`;
							}
							else {
								content = `Hey @${tags.username}, you have ${(resData.response ? resData.response : 0)} KomfyCoins stashed in your wallet!`;
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'no_twitch_id') {
								content = 'That username doesn\'t seem to be in our system.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie. 2';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie. 1';
					})
					.finally(function() {
						client.say(channel, content);
						axios.post(data.settings.finalUrl + 'coins/update');
					});
			},
		},
		add: {
			help: 'MOD command that allows adding coins to a wallet. !coins add <username:required> <amt:required> <reason:optional>',
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			args: {
				1: [ 'r' ],
				2: [ 'r' ],
				3: [ 'o' ],
				error: 'don\'t forgot the user or the amount!',
			},
			execute(args, tags, message, channel, client) {

				let content = '';

				const reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();
				const jsonData = { 'amt': args[3], 'ident_type': 'twitch_username', 'ident': args[2].replace('@', ''), 'reason': reason };

				axios.get(data.settings.finalUrl + 'coins/insert/json/' + encodeURIComponent(JSON.stringify(jsonData)))
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `Congrats @${args[2].replace('@', '')} on adding ${args[3]} KomfyCoins to your wallet.`;
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
						axios.post(data.settings.finalUrl + 'coins/update');
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

				let reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').trim();
				reason = `SPENT: ${reason}`;
				const jsonData = { 'amt': (Math.abs(args[2]) * -1), 'ident_type': 'twitch_username', 'ident': tags.username, 'reason': reason };

				axios.get(data.settings.finalUrl + 'coins/insert/json/' + encodeURIComponent(JSON.stringify(jsonData)))
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `Congrats @${tags.username} on spending ${Math.abs(args[2])} KomfyCoins.`;
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
						axios.post(data.settings.finalUrl + 'coins/update');
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
													axios.post(data.settings.finalUrl + 'coins/update');
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
													axios.post(data.settings.finalUrl + 'coins/update');
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
									axios.post(data.settings.finalUrl + 'coins/update');
								});
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
						axios.post(data.settings.finalUrl + 'coins/update');
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
		// special stuff
		handlePassiveIncome: {
			execute(tags, channel, client) {

				const jsonData = { 'amt': tags['passiveAmt'], 'ident_type': 'twitch_id', 'ident': tags['user-id'] };
				axios.get(data.settings.finalUrl + 'coins/passive/json/' + encodeURIComponent(JSON.stringify(jsonData)))
					.catch(function() {
						client.say(channel, 'Something went wrong with the passive income, tell @kittenAngie.');
					});
			},
		},
	},
};