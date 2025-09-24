const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'snacks',
	channel: ['komfykiwi', 'komfybot'],
	help: 'Commands for giving snacks to Hattington. Additional arguments: buy, give, inv',
	aliases: {
		'snack': {
			arg: false,
			list: false,
		},
		'snackbuy': {
			arg: 'buy',
			list: false,
		},
	},
	actions: {
		default: {
			say: 'Welcome to SNACS, the Sugary / Nutritious Allocation and Conveyance Service: ' +
			'You can use me to give Hattington one of your snacks!' +
			'Curious what snacks we have? Use "!coins store" to see what\'s available!' +
			'Then you can use "!snack buy <snack-name>" to buy a snack.' +
			'After that, use "!snacks give <snack-name>" to give it to Hattington.' +
			'Curious what snacks you currently have? "!snacks inv" will list them out for you!' +
			'If you need more help, check out !help coins and !help snacks.',
		},
		buy: {
			help: 'Buy an Random Hat from the KomfyStore. !hattington buy',
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the snack name!',
			},
			execute(args, tags, message, channel, client) {

				let content = '';
				const userID = tags['user-id'];
				const username = tags.username;
				let item = message.replace(args[0], '').replace(args[1], '').trim();
				let itemOut = item;
				let bought = false;

				if (item.indexOf(':') === -1) {
					item = 'snacks : ' + item;
				}
				else {
					itemOut = itemOut.substring(itemOut.indexOf(':') + 1).toLowerCase().trim();
				}

				if (item.toLowerCase() === 'random hat') {
					content = 'You\'ll need to use the !hat buy command instead.';
					client.say(channel, content);
				}
				else {
					axios.get(data.settings.baseUrl + 'retrieve/store/?item=' + item.toLowerCase())
						.then(function(response) {
							const resData = response.data;

							if (resData.status === 'failure') {
								content += `No item named ${item}, or that item isn't available`;
							}
							else {
								const cost = resData.content;
								const reason = 'BOUGHT: ' + item;
								bought = true;

								axios.get(data.settings.baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + (cost * -1) + '&reason=' + reason)
									.then(function(response2) {
										const resData2 = response2.data;
										if (resData2.status === 'success') {
											axios.get(data.settings.baseUrl + 'interactive/coins/store_purchase?twitch_id=' + userID + '&item=' + item)
												.then(function(response3) {
													const resData3 = response3.data;
													if (resData3.status === 'success') {
														if (resData3.content.qty == 1) {
															content = `Congrats @${username} on buying ${itemOut} @ ${cost} KomfyCoins.`;
														}
														else {
															content = `Congrats @${username} on buying more ${itemOut} @ ${cost} KomfyCoins. You now have ${resData3.content.qty} of them.`;
														}
													}
													else {
														data.errorMsg.handle(channel, client, 'snacks-buy', 'Failed response - add to inv');
													}
												})
												.catch(function() {
													data.errorMsg.handle(channel, client, 'snacks-buy', 'Issue while adding to inventory');
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
															.catch(() => {
																data.errorMsg.handle(channel, client, 'snacks-buy', 'Issue while getting coin count');
															})
															.finally(function() {
																client.say(channel, `${content}`);
															});
													}
													else {
														client.say(channel, `${content}`);
													}
													axios.post(data.settings.finalUrl + 'coins/update');
												});
										}
										else if (resData2.status === 'failure' && resData2.err_msg === 'not_enough_coins') {
											content = 'You seem to be out of KomfyCoins.';
										}
										else {
											data.errorMsg.handle(channel, client, 'snacks-buy', 'Failed response - transaction');
										}
									})
									.catch(function() {
										data.errorMsg.handle(channel, client, 'snacks-buy', 'Issue while handling transaction');
									})
									.finally(function() {
										client.say(channel, content);
										axios.post(data.settings.finalUrl + 'coins/update');
									});
							}
						})
						.catch(function() {
							data.errorMsg.handle(channel, client, 'snacks-buy', 'Issue while retrieving item');
						})
						.finally(function() {
							if (content !== '') {
								client.say(channel, content);
							}
							axios.post(data.settings.finalUrl + 'coins/update');
						});
				}
			},
		},
		give: {
			help: 'Give a snack to Hattington. !snack give <snack-name:required>',
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the snack name!',
			},
			execute(args, tags, message, channel, client) {

				let content = '';
				const userID = tags['user-id'];
				let snack = message.replace(args[0], '').replace(args[1], '').trim().toLowerCase();
				let snackOut = snack;

				if (snack.indexOf(':') === -1) {
					snack = 'snacks : ' + snack;
				}
				else {
					snackOut = snackOut.substring(snackOut.indexOf(':') + 1).toLowerCase().trim();
				}

				// Check if the user has the snack...
				axios.get(data.settings.finalUrl + 'snacks/retrieve/lookup/' + userID + '/' + snackOut)
					.then(function(response) {
						const resData = response.data;
						if (resData.status == 'success') {

							const snackData = { 'type': 'snack', 'item': resData.content['snackID'], 'emote': JSON.parse(resData.content.response) };

							axios.get(data.settings.finalUrl + 'snacks/insert/' + userID + '/' + resData.content['unique_id'])
								.then(function(response2) {
									const resData2 = response2.data;
									if (resData2.status == 'success') {
										content = 'Found your snack, giving it to Hattington!';
										data.functions.handleWebsocketRedeem('hattington', snackData, client);
									}
								})
								.finally(function() {
									client.say(channel, content);
								});
						}
						else if (resData.status == 'failure') {
							if (resData.err_msg == 'no_snacks') {
								content = `Seems like you don't have a "${snackOut}" in your inventory. You might want to check your spelling.`;
							}
							else if (resData.err_msg == 'timeout') {
								content = `Hattington seems to be enjoying their last snack, give them a little time! (Roughly ${resData.time_left} minutes)`;
							}
							else {
								data.errorMsg.handle(channel, client, 'snacks-give', 'Failed response');
							}
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'snacks-give', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, content);
						}
					});
			},
		},
		inv: {
			help: 'Shows your inventory of snacks. !snacks inv',
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];

				axios.get(data.settings.baseUrl + 'interactive/snacks/inventory?twitch_id=' + userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if (Object.keys(resData.content).length) {
								content += 'Here\'s whats in your inventory: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(resData.content).forEach(([key, details]) => {
									if (details['qty'] > 0) {
										content += `${details['qty']}x ${details['name']}, `;
									}
								});
								content = content.substring(0, content.length - 2);
							}
							else {
								content += 'You don\'t currently have any snacks!';
							}
						}
						else {
							data.errorMsg.handle(channel, client, 'snacks-inv', 'Failed response');
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'snacks-inv', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, content);
						}
					});
			},
		},
		store: {
			help: 'Lists out items available at the Snack Shack. !snacks store',
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.baseUrl + 'retrieve/store')
					.then(function(response) {
						const resData = response.data;

						content += 'Here\'s whats in the store:';
						resData.content.forEach(element => {
							if (element['name'].indexOf('Snack') !== -1) {
								if (element['enabled'] == 1) {
									content += ' ' + element['name'].replace('Snacks : ', '') + ' @ ' + element['value'] + ' KomfyCoins ||';
								}
							}
						});
						content = content.substring(0, content.length - 3);

					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'snacks-store', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, content);
						}
					});
			},
		},
	},
};