const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'hattington',
	description: 'Hattington commands',
	help: 'Commands for interacting with Hattington. Additional arguments: inv, buy, set, check',
	actions: {
		default: {
			say: 'I\'m the HAT ALLOCATION and TRANSFER SERVICE, or HATS for short: ' +
			'You can use me to give Hattington one of your hats! Need to buy a hat? ' +
			'Use the command "!hat buy" to buy one for 160 KomfyCoins. Want to see ' +
			'which hats you have? That\'d be "!hats inv". Wanna place one on Hattington? That\'s ' +
			'!hats set <hat-name>". If you need more help, check out !help coins and !help hats.',
		},
		inv: {
			help: 'Shows your inventory of hats. !hattington inv',
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];

				axios.get(baseUrl + 'interactive/hats/hat_inventory?twitch_id=' + userID)
					.then(function(response) {
						const data = response.data;
						if (data.status === 'success') {
							if (Object.keys(data.content).length) {
								// content += 'Here\'s whats in your inventory: ';
								Object.entries(data.content).forEach(([rarity, hats]) => {
									content += `${rarity}: `;
									Object.entries(hats).forEach(([key, hat]) => {
										content += `${hat['qty']}x ${hat['name']}, `;
									});
									content = content.substring(0, content.length - 2);
									content += ' || ';
								});
								content = content.substring(0, content.length - 3);
							}
							else {
								content += 'You don\'t currently have any hats!';
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

				axios.get(baseUrl + 'interactive/hats/hat_sell?twitch_id=' + userID + '&hat=' + hat)
					.then(function(response) {
						const data = response.data;
						if (data.status === 'success') {
							content = tags['username'] + ', ' + data.content;
						}
						else if (data.status === 'failure') {

							switch (data.err_msg) {
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
						client.say(channel, content);
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

				axios.get(baseUrl + 'interactive/hats/hat_inventory?twitch_id=' + userID)
					.then(function(response) {
						const data = response.data;
						if (data.status === 'success') {
							let matched = false;
							data.reference.forEach(element => {
								if (element['name'].toLowerCase() === hat.toLowerCase()) {
									matched = element;
								}
							});

							if (matched) {
								axios.get(baseUrl + 'interactive/hats/hat_set?userID=' + userID + '&hat=' + matched['hat_id'])
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
		check: {
			help: 'Check the timer for hat swapping. !hattington check',
			execute(args, tags, message, channel, client) {
				let content = '';

				axios.get(baseUrl + 'interactive/hats/hat_set?check')
					.then(function(response2) {
						const data2 = response2.data;
						if (data2.status === 'success') {
							content = 'Looks like Hattington is ready for a new hat!';
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
			},
		},
	},
};