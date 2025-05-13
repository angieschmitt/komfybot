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
														content = 'e Something went wrong, tell @kittenAngie.';
													}
												})
												.catch(function() {
													content = 'd Something went wrong, tell @kittenAngie.';
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
															.catch(err => console.log(err))
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
											content = 'c Something went wrong, tell @kittenAngie.';
										}
									})
									.catch(function() {
										content = 'b Something went wrong, tell @kittenAngie.';
									})
									.finally(function() {
										client.say(channel, content);
										axios.post(data.settings.finalUrl + 'coins/update');
									});
							}
						})
						.catch(function() {
							content = 'a Something went wrong, tell @kittenAngie.';
						})
						.finally(function() {
							client.say(channel, content);
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

				// Get user inventory...
				axios.get(data.settings.baseUrl + 'interactive/snacks/inventory?twitch_id=' + userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							// Check if snack in inv...
							let matched = false;
							Object.entries(resData.reference).forEach(([key, value]) => {
								if (key.toLowerCase() === snack.toLowerCase()) {
									if (parseInt(value.qty) > 0) {
										matched = value;
									}
								}
							});

							if (matched) {
								axios.get(data.settings.baseUrl + 'interactive/snacks/insert?userID=' + userID + '&snack=' + matched['snack_id'] + '&item_id=' + matched['item_id'])
									.then(function(response2) {
										const resData2 = response2.data;
										if (resData2.status === 'success') {
											content = 'Found your snack, giving it to Hattington!';
										}
										else if (resData2.status === 'failure') {
											if (resData2.err_msg == 'timeout') {
												content = `Hattington seems to be enjoying their last snack, give them a little time! (Roughly ${resData2.time_left} minutes)`;
											}
										}
										else {
											content = 'Something went wrong, tell @kittenAngie "snacks-d" :)';
										}
									})
									.catch(function() {
										content = 'Something went wrong, tell @kittenAngie "snacks-c" :)';
									})
									.finally(function() {
										client.say(channel, content);
									});
							}
							else {
								content = `Seems like you don't have a "${snackOut}" in your inventory. You might want to check your spelling.`;
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie  "snacks-b" :)';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie "snacks-a" :)';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
		inv: {
			help: 'Shows your inventory of hats. !hattington inv',
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
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
	},
};