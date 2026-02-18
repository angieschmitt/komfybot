const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	name: 'store',
	help: 'Command to interact with the store. Additional args: add',
	addon: 1,
	aliases: {
		'buy': {
			arg: 'buy',
			list: false,
		},
		'sell': {
			arg: 'sell',
			list: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				const category = (1 in args ? args[1] : false);

				let content = '';
				axios.get(client.endpoint + 'store/products/' + client.userID + (category ? '/' + category : ''))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							// If we have results...
							if (Object.keys(resData.response).length) {
								content += 'Here\'s whats in the store:';
								Object.entries(resData.response).forEach(([key, itemDetails]) => { // eslint-disable-line no-unused-vars
									const itemData = JSON.parse(itemDetails['itemData']);
									content += ' ' + itemDetails['name'] + ' : ' + itemData['cost'] + ' ||';
								});
								content = content.substring(0, content.length - 3);
							}
							else if (Object.keys(resData.response).length == 0) {
								// Change if category set...
								if (category) {
									content = `It appears as though there are no "${category}" in the store.`;
								}
								else {
									content = 'It appears as though there is nothing in the store.';
								}
							}
							else {
								content = 'Uhm. Weird. The store is on fire.';
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								// data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
							}
							else {
								// data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
							}
						}
						else {
							// data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
						}
					})
					.catch(function() {
						// data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
						}
					});
			},
		},
		cats: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'store/categories/' + client.userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							// If we have results...
							if (Object.keys(resData.response).length) {
								content += 'Here\'s what categories are in the store:';
								Object.entries(resData.response).forEach(([key, catDetails]) => { // eslint-disable-line no-unused-vars
									content += ' ' + catDetails['name'] + ' ||';
								});
								content = content.substring(0, content.length - 3);
							}
							else if (Object.keys(resData.response).length == 0) {
								content = 'It appears as though there are no categories in this store.';
							}
							else {
								content = 'Uhm. Weird. The store is on fire.';
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								// data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
							}
							else {
								// data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
							}
						}
						else {
							// data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
						}
					})
					.catch(function() {
						// data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
						}
					});
			},
		},
		inv: {
			execute(args, tags, message, channel, client) {

				const viewerID = tags['user-id'];
				const category = (2 in args ? args[2] : false);
				const rarity = (3 in args ? args[3] : false);

				let content = '';
				axios.get(client.endpoint + 'store/inventory/' + client.userID + '/' + viewerID + (category ? '/' + category : ''))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {

							// Handle the sections of data
							Object.entries(resData.response).forEach(([type]) => {
								if (type == 'default') {
									Object.entries(resData.response['default']).forEach(([category, items]) => {
										content += `You have ${items.length} different ${category}: `;
										let itemsOut = '';
										Object.entries(items).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
											itemsOut += `${item['qty']}x ${item['name']}, `;
										});
										itemsOut = itemsOut.substr(0, itemsOut.length - 2).trim();
										content += itemsOut + '.';
									});
								}
								else if (type == 'gacha') {
									Object.entries(resData.response['gacha']).forEach(([category, items]) => {
										const gachaOutput = module.exports.handleGacha(category, items, rarity);
										content += `${gachaOutput}.`;
									});
								}
							});
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'no_items_in_inv') {
								content += 'Looks like you don\'t have anything in your inventory.';
							}
							else if (resData.err_msg === 'missing_authorization') {
								// data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
							}
							else {
								// data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
							}
						}
						else {
							// data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
						}
					})
					.catch(function() {
						// data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
						}
					});
			},
		},
		buy: {
			execute(args, tags, message, channel, client) {

				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				let content = '';
				let item = message.replace(args[0], '').replace(args[1], '').trim();
				let amt = args.at(-1);
				if (!amt.match(/[^$,.\d]/)) {
					item = item.substr(0, item.length - ((amt.length) + 1)).trim();
				}
				else {
					amt = 1;
				}

				if (item == '') {
					content = 'You need to include the item to buy.';
					functions.sayHandler(client, content);
					return;
				}

				axios.get(client.endpoint + 'store/buy/' + client.userID + '/' + viewerID + '/' + item + '/' + amt)
					.then(function(response) {
						const resData = response.data;

						if (resData.status === 'success') {

							// If a gacha item, handle it...
							if ('gacha' in resData.response) {
								content = `Congrats @${viewer}, you bought ${resData.response.qty}x Gacha Rolls for ${resData.response.cost} ${(resData.response.cost > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}`;
								if (Object.keys(resData.response.gacha).length > 1) {
									content += ' and it rolled the following items: ';
								}
								else {
									content += ' and it rolled the following item: ';
								}
								Object.entries(resData.response.gacha).forEach(([idx, entry]) => { // eslint-disable-line no-unused-vars
									if (entry.qty > 1) {
										content += ` Another ${entry.item} (${entry.rarity}) from Set #${entry.itemSet}, `;
									}
									else {
										content += ` A ${entry.item} (${entry.rarity}) from Set #${entry.itemSet}, `;
									}
								});
								content = content.substring(0, (content.length - 2));
							}
							else {
								content = `Congrats @${viewer} on buying ${resData.response.qty}x ${resData.response.item} for ${resData.response.cost} ${(resData.response.cost > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
							}

						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'not_enough_coins') {
								content = `It looks like you need ${resData.response} more ${(resData.response > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)} to complete the purchase.`;
							}
							else if (resData.err_msg == 'gacha_item') {
								content = 'You can\'t directly buy a Gacha item.';
							}
							else if (resData.err_msg == 'product_disabled') {
								content = 'It looks like that product is currently disabled.';
							}
							else if (resData.err_msg == 'couldnt_locate_product') {
								content = `The product "${item}" couldn't be located in the store`;
							}
							else if (resData.err_msg === 'missing_authorization') {
								// data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
							}
							else {
								// data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
							}
						}
						else {
							// data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
						}
					})
					.catch(function() {
						// data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
						}
					});
			},
		},
		sell: {
			execute(args, tags, message, channel, client) {

				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				let content = '';
				let item = message.replace(args[0], '').replace(args[1], '').trim();
				let amt = args.at(-1);
				if (!amt.match(/[^$,.\d]/)) {
					item = item.substr(0, item.length - ((amt.length) + 1)).trim();
				}
				else {
					amt = 1;
				}

				if (item == '') {
					content = 'You need to include the item to sell.';
					functions.sayHandler(client, content);
					return;
				}

				// Check for a dupes sell...
				if (item.indexOf('dupes') !== false) {
					const category = item.split(' ')[1];
					if (category == undefined) {
						functions.sayHandler(client, 'You have to provide a category.');
					}
					else if (!(client.store.categories.includes(category.toLowerCase()))) {
						functions.sayHandler(client, `"${category}" isn't a valid category`);
					}
					// Now we handle the dupes sell...
					else {
						axios.get(client.endpoint + 'store/dupes/' + client.userID + '/' + viewerID + '/' + category)
							.then(function(response) {
								const resData = response.data;
								if (resData.status === 'success') {

									let total = 0;
									content += 'You\'ve sold the following items: ';
									Object.entries(resData.response).forEach(([idx, details]) => { // eslint-disable-line no-unused-vars
										content += details.qty + 'x ' + details.name + ' || ';
										total += details.value;
									});
									content = content.substring(0, content.length - 3).trim();
									content += ` for a total of ${total} ${(total > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
								}
								else if (resData.status === 'failure') {
									if (resData.err_msg == 'no_dupes') {
										content = 'No dupes located for that category.';
									}
									else if (resData.err_msg === 'missing_authorization') {
										// data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
									}
									else {
										// data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
									}
								}
								else {
									// data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
								}
							})
							.catch(function() {
								// data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
							})
							.finally(function() {
								if (content !== '') {
									functions.sayHandler(client, content);
								}
							});
					}
				}
				// If not a dupes sell, handle normally...
				else {
					let content = '';
					axios.get(client.endpoint + 'store/sell/' + client.userID + '/' + viewerID + '/' + encodeURIComponent(item) + '/' + amt)
						.then(function(response) {
							const resData = response.data;
							if (resData.status === 'success') {

								// If the qty was adjusted, adjust message...
								if (resData.response.qtyAdjusted) {
									if (resData.response.qty == 0) {
										if (resData.response.type == 'default') {
											content = `Sorry @${viewer}, you don't have any ${resData.response.name} to sell.`;
										}
										else if (resData.response.type == 'gacha') {
											content = `Sorry @${viewer}, you can't sell your last ${resData.response.name}`;
										}
									}
									else {
										content = `Congrats @${viewer}, you sold ${resData.response.qty}x ${resData.response.name} for ${resData.response.value} ${(resData.response.value > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}. `;
									}
								}
								else {
									content = `Congrats @${viewer}, you sold ${resData.response.qty}x ${resData.response.name} for ${resData.response.value} ${(resData.response.value > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}`;
								}
							}
							else if (resData.status === 'failure') {
								if (resData.err_msg == 'product_disabled') {
									content = 'It looks like that product is currently disabled.';
								}
								else if (resData.err_msg == 'couldnt_locate_product') {
									content = `The product "${item}" couldn't be located in the store`;
								}
								else if (resData.err_msg === 'missing_authorization') {
									// data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
								}
								else {
									// data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
								}
							}
							else {
								// data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
							}
						})
						.catch(function() {
							// data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
						})
						.finally(function() {
							if (content !== '') {
								functions.sayHandler(client, content);
							}
						});
				}
			},
		},
	},
	handleGacha(category, items, rarity = false) {

		const rarities = {
			'common'		: 1,
			'uncommon'		: 2,
			'rare'			: 3,
			'super-rare'	: 4,
			'superrare'		: 4,
			'custom'		: 5,
		};

		let gachaOutput = '';

		// If passed a rarity, we output the items...
		if (rarity) {
			const rarityID = rarities[rarity];
			// Found the rarity...
			if (rarityID) {
				rarity = rarity.toLowerCase().replace(/\b[a-z]/g, function(letter) {
					return letter.toUpperCase();
				});
				gachaOutput = ` Here's your ${rarity} ${category}: `;
				Object.entries(items).forEach(([rarityLevel, setLevel]) => {
					if (rarityLevel == rarityID) {
						Object.entries(setLevel).forEach(([set, items]) => { // eslint-disable-line no-unused-vars
							Object.entries(items).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
								gachaOutput += `${item['name']}, `;
							});
						});
					}
				});
				gachaOutput = gachaOutput.substring(0, gachaOutput.length - 2);
			}
			// Didn't, so return error-ish...
			else {
				gachaOutput = `Couldn't locate items with rarity: ${rarity}`;
			}
		}
		// Otherwise we do a breakdown...
		else {
			gachaOutput = ` Here's your ${category} breakdown: `;
			Object.entries(items).forEach(([rarityLevel, setLevel]) => {
				let count = 0;
				Object.entries(setLevel).forEach(([set, items]) => { // eslint-disable-line no-unused-vars
					count += items.length;
				});
				let rarityName = module.exports.getKeyByValue(rarities, rarityLevel);
				rarityName = rarityName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
					return letter.toUpperCase();
				});
				gachaOutput += `${count} ${rarityName}, `;
			});
			gachaOutput = gachaOutput.substring(0, gachaOutput.length - 2);
		}

		return gachaOutput;
	},
	getKeyByValue(object, value) {
		let entry = false;
		Object.entries(object).forEach(([key, val]) => {
			if (val == value && !entry) {
				entry = key;
			}
		});
		return entry;
	},
	isInt(value) {
		const x = parseFloat(value);
		return !isNaN(value) && (x | 0) === x;
	},
};