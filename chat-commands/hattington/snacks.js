const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'snacks',
	help: 'Commands for giving snacks to Hattington. Additional arguments: buy, give, inv',
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
					axios.get(baseUrl + 'retrieve/store/?item=' + item.toLowerCase())
						.then(function(response) {
							const data = response.data;

							if (data.status === 'failure') {
								content += `No item named ${item}, or that item isn't available`;
							}
							else {
								const cost = data.content;
								const reason = 'BOUGHT: ' + item;

								axios.get(baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&amount=' + (cost * -1) + '&reason=' + reason)
									.then(function(response2) {
										const output = response2.data;
										if (output.status === 'success') {
											axios.get(baseUrl + 'interactive/coins/store_purchase?twitch_id=' + userID + '&item=' + item)
												.then(function(response3) {
													const output3 = response3.data;
													if (output3.status === 'success') {
														if (output3.content.qty == 1) {
															content = `Congrats @${username} on buying ${itemOut} @ ${cost} KomfyCoins.`;
														}
														else {
															content = `Congrats @${username} on buying more ${itemOut} @ ${cost} KomfyCoins. You currently have ${output3.content.qty}.`;
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

				axios.get(baseUrl + 'interactive/snacks/inventory?twitch_id=' + userID)
					.then(function(response) {
						const data = response.data;
						if (data.status === 'success') {
							let matched = false;
							Object.entries(data.reference).forEach(([key, value]) => {
								if (key.toLowerCase() === snack.toLowerCase()) {
									if (parseInt(value.qty) > 0) {
										matched = value;
									}
								}
							});

							if (matched) {
								axios.get(baseUrl + 'interactive/snacks/insert?userID=' + userID + '&snack=' + matched['snack_id'] + '&item_id=' + matched['item_id'])
									.then(function(response2) {
										const data2 = response2.data;
										if (data2.status === 'success') {
											content = 'Found your snack, giving it to Hattington!';
										}
										else if (data2.status === 'failure') {
											if (data2.err_msg == 'timeout') {
												content = `Hattington seems to be enjoying their last snack, give them a little time! (Roughly ${data2.time_left} minutes)`;
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
								content = `Seems like you don't have a "${snackOut}" in your inventory. You might want to check your spelling.`;
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
		inv: {
			help: 'Shows your inventory of hats. !hattington inv',
			execute(args, tags, message, channel, client) {
				let content = '';
				const userID = tags['user-id'];

				axios.get(baseUrl + 'interactive/snacks/inventory?twitch_id=' + userID)
					.then(function(response) {
						const data = response.data;
						if (data.status === 'success') {
							if (Object.keys(data.content).length) {
								content += 'Here\'s whats in your inventory: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(data.content).forEach(([key, details]) => {
									if (details['qty'] > 0) {
										content += `${details['qty']}x ${details['name']}, `;
									}
								});
								content = content.substring(0, content.length - 2);
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
		store: {
			help: 'Lists out items available at the Snack Shack. !snacks store',
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'retrieve/store')
					.then(function(response) {
						const data = response.data;

						content += 'Here\'s whats in the store:';
						data.content.forEach(element => {
							console.log(element['name'].indexOf('Snack'));
							if (element['name'].indexOf('Snack') !== -1) {
								content += ' ' + element['name'].replace('Snacks : ', '') + ' @ ' + element['value'] + ' KomfyCoins ||';
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