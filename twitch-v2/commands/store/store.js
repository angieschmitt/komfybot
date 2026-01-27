const axios = require('axios');

module.exports = {
	name: 'store',
	help: 'Command to interact with the store. Additional args: add',
	addon: 1,
	aliases: {
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
							client.say(channel, content);
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
							client.say(channel, content);
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
							client.say(channel, content);
						}
					});
			},
		},
		buy: {
			execute(args, tags, message, channel, client) {

				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				let item = message.replace(args[0], '').replace(args[1], '').trim();
				let amt = parseInt(args.at(-1));
				// If amt is a number...
				if (module.exports.isInt(amt)) {
					// remove it from the end of the item...
					item = item.substr(0, item.length - ((amt.toString.length) + 1));
				}
				// Otherwise just set amt...
				else {
					amt = 1;
				}

				let content = '';
				axios.get(client.endpoint + 'store/buy/' + client.userID + '/' + viewerID + '/' + item + '/' + amt)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `Congrats @${viewer} on buying ${resData.response.qty}x ${resData.response.item} for ${resData.response.cost} ${(resData.response.cost > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'not_enough_coins') {
								content = `It looks like you need ${resData.response} more ${(resData.response > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)} to complete the purchase.`;
							}
							else if (resData.err_msg == 'product_disabled') {
								content = 'It looks like that product is currently disabled.';
							}
							else if (resData.err_msg == 'couldnt_locate_product') {
								content = 'That product couldn\'t be located.';
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
							client.say(channel, content);
						}
					});
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

		console.log(rarity);

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