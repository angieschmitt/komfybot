const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'hattington',
	channel: ['komfykiwi', 'komfybot'],
	help: 'Commands for interacting with Hattington. Additional arguments: buy, check, inv, sell, set',
	aliases: {
		'hat': {
			arg: false,
			list: false,
		},
		'hats': {
			arg: false,
		},
		'hatbuy': {
			arg: 'buy',
			list: false,
		},
	},
	actions: {
		default: {
			say: 'I\'m the HAT ALLOCATION and TRANSFER SERVICE, or HATS for short: ' +
			'You can use me to give Hattington one of your hats! Need to buy a hat? ' +
			'Use the command "!hat buy" to buy one for 160 KomfyCoins. Want to see ' +
			'which hats you have? That\'d be "!hats inv". Wanna place one on Hattington? That\'s ' +
			'!hats set <hat-name>". If you need more help, check out !help coins and !help hats.',
		},
		check: {
			help: 'Check the timer for hat swapping. !hattington check',
			execute(args, tags, message, channel, client) {
				let content = '';

				axios.get(data.settings.baseUrl + 'interactive/hats/hat_set?check')
					.then(function(response2) {
						const resData = response2.data;
						if (resData.status === 'success') {
							content = 'Looks like Hattington is ready for a new hat!';
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'timeout') {
								content = `Hattington seems to be enjoying their current hat, give them a little time! (Roughly ${resData.time_left} minutes)`;
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
		buy: {
			help: 'Buy an Random Hat from the KomfyStore. !hattington buy',
			execute(args, tags, message, channel, client) {
				args[1] = 'Random Hat';

				let content = '';
				const userID = tags['user-id'];
				const username = tags.username;
				const item = args[1];
				let bought = false;

				axios.get(data.settings.baseUrl + 'retrieve/store/?item=' + item.toLowerCase())
					.then(function(response) {
						const resData = response.data;

						if (resData.status === 'failure') {
							content += `No item named ${item}`;
						}
						else {
							const cost = resData.content;
							const reason = 'BOUGHT: ' + item;
							bought = true;

							axios.get(data.settings.baseUrl + 'insert/coins/?twitch_id=' + userID + '&username=' + username + '&amount=' + (cost * -1) + '&reason=' + reason)
								.then(function(response2) {
									const output = response2.data;
									if (output.status === 'success') {
										// Random Hat catch!
										if (item.toLowerCase() === 'random hat') {
											axios.get(data.settings.baseUrl + 'interactive/hats/hat_random?user=' + userID)
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
															content += ` You unwrapped a ${output3.content.item} (${rarityText})!`;
														}
														else {
															content += ` You unwrapped another ${output3.content.item} (${rarityText})!`;
														}
													}
													else {
														content = 'Something went wrong, tell @kittenAngie: Hats 5.';
													}
												})
												.catch(function() {
													content = 'Something went wrong, tell @kittenAngie: Hats 4.';
												})
												.finally(function() {
													// Get coin count
													if (bought) {
														client.commands[channel.replace('#', '')].coins.actions.coincount.execute(tags)
															.then((coinAmt) => {
																if (coinAmt) {
																	content += ` You have ${(coinAmt ? coinAmt : 0)} KomfyCoins remaining!`;
																}
															})
															.finally(function() {
																client.say(channel, `${content}`);
															});
													}
													else {
														client.say(channel, `${content}`);
													}
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
										content = 'Something went wrong, tell @kittenAngie: Hats 3.';
									}
								})
								.catch(function() {
									content = 'Something went wrong, tell @kittenAngie: Hats 2.';
								})
								.finally(function() {
									client.say(channel, content);
								});
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
		give: {
			help: 'STREAMER command to give a hat to a user. !hattington give <username:required> <hat-name:required>',
			perms: {
				levels: ['streamer', 'admin'],
				error: 'This is a streamer only command',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const username = args[2].replace('@', '').trim();
				const hat = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').trim();

				axios.get(data.settings.baseUrl + 'interactive/hats/hat_give?username=' + username + '&hat=' + hat)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = resData.content;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'missing_user') {
								content = 'You forgot to include a user';
							}
							else if (resData.err_msg == 'missing_hat') {
								content = 'You forgot to include a hat';
							}
							else if (resData.err_msg == 'no_hat') {
								content = `Sorry boss, no "${hat}" in the backstock. You might want to check your spelling.`;
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
						if ('silent' in tags) {
							if (tags.silent !== true) {
								client.say(channel, content);
							}
						}
						else {
							client.say(channel, content);
						}
					});
			},
		},
		inv: {
			help: 'Shows your inventory of hats. !hattington inv',
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];

				console.log(channel);

				axios.get(data.settings.baseUrl + 'interactive/hats/hat_inventory?twitch_id=' + userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							// Change output based on total number of hats
							if (resData.counts['TOTAL'] > 0) {
								if (resData.counts['TOTAL'] < 26) {
									// content += 'Here\'s what hats you have: ';
									Object.entries(resData.content).forEach(([rarity, hats]) => {
										content += `${rarity}: `;
										// eslint-disable-next-line no-unused-vars
										Object.entries(hats).forEach(([key, hat]) => {
											if (hat['qty'] >= 1) {
												content += `${hat['qty']}x ${hat['name']}, `;
											}
										});
										content = content.substring(0, content.length - 2);
										content += ' || ';
									});
									content = content.substring(0, content.length - 3);
								}
								else if (resData.counts['TOTAL'] >= 26) {
									if (args.length === 2) {
										content += 'You currently have ';
										let i = 1;
										Object.entries(resData.counts).forEach(([rarity, count]) => {
											if (rarity !== 'TOTAL') {
												if (i == Object.keys(resData.counts).length - 1) {
													content += `and ${count}x ${ucwords(rarity)} hats. `;
												}
												else {
													// eslint-disable-next-line
													if (count >= 1) {
														content += `${count}x ${ucwords(rarity)} hats, `;
													}
												}
											}
											i++;
										});
										content += `That brings you to ${resData.counts['TOTAL']} hats in all. `;
										content += 'Use !hats inv <rarity> to see the specific hats.';
									}
									else {
										const rarity = args[2].toUpperCase();
										// eslint-disable-next-line
										if ( resData.counts[rarity] > 0 ){
											content += `Here's the ${rarity} hats you have: `;
											// eslint-disable-next-line no-unused-vars
											Object.entries(resData.content[rarity]).forEach(([key, hat]) => {
												content += `${hat['qty']}x ${hat['name']}, `;
											});
											content = content.substring(0, content.length - 2);
										}
										else {
											content = `Seems like you don't have any ${rarity} hats.`;
										}
									}
								}
							}
							else {
								content += 'You don\'t currently have any hats!';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie. 1';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie. 2';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
		sell: {
			help: 'Sell a hat for 40/80/160 KomfyCoins. !hattington sell <hat-name:required>',
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the hat name!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];
				const hat = message.replace(args[0], '').replace(args[1], '').trim();
				let sold = false;

				axios.get(data.settings.baseUrl + 'interactive/hats/hat_sell?twitch_id=' + userID + '&hat=' + hat)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							sold = true;
							content = tags['username'] + ', ' + resData.content + '.';
						}
						else if (resData.status === 'failure') {

							switch (resData.err_msg) {
							case 'one_hat':
								content = 'Sorry, but you can\'t sell your last ' + hat + '!';
								break;
							case 'no_hat':
								content = 'Seems like you don\'t have a ' + hat + ' in your inventory. You might want to check your spelling.';
								break;
							case 'sell_issue':
								content = 'Something went wrong selling your hat, tell @kittenAngie!';
								break;
							case 'coins_issue':
								content = 'Something went wrong giving you your coins, tell @kittenAngie!';
								break;
							default:
								content = 'Something went wrong, tell @kittenAngie.';
								break;
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
						// Get coin count
						if (sold) {
							client.commands[channel.replace('#', '')].coins.actions.coincount.execute(tags)
								.then((coinAmt) => {
									if (coinAmt) {
										content += ` You have ${(coinAmt ? coinAmt : 0)} KomfyCoins stashed in your wallet!`;
									}
								})
								.finally(function() {
									client.say(channel, `${content}`);
								});
						}
						else {
							client.say(channel, `${content}`);
						}
					});
			},
		},
		set: {
			help: 'Put a hat you own on Hattington. !hattington set <hat-name:required>',
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the hat name!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];
				const hat = message.replace(args[0], '').replace(args[1], '').trim();

				axios.get(data.settings.baseUrl + 'interactive/hats/hat_inventory?twitch_id=' + userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							let matched = false;
							Object.entries(resData.reference).forEach(([key, value]) => {
								if (key.toLowerCase() === hat.toLowerCase()) {
									matched = value;
								}
							});

							if (matched) {
								axios.get(data.settings.baseUrl + 'interactive/hats/hat_set?userID=' + userID + '&hat=' + matched['hat_id'])
									.then(function(response2) {
										const data2 = response2.data;
										if (data2.status === 'success') {
											content = 'Found your hat, giving it to Hattington!';
										}
										else if (data2.status === 'failure') {
											if (data2.err_msg == 'timeout') {
												content = `Hattington seems to be enjoying their current hat, give them a little time! (Roughly ${data2.time_left} minutes)`;
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
							else {
								content = `Seems like you don't have a "${hat}" in your inventory. You might want to check your spelling.`;
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

function ucwords(string) {
	return string.toLowerCase().replace(/(?<= )[^\s]|^./g, a => a.toUpperCase());
}