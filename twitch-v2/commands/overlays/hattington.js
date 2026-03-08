const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	list: true,
	channel: [ 2 ],
	name: 'hatty',
	help: 'Commands for Hattington. Usage: !hatty || Additional arguments: hat, snack',
	allowOffline: false,
	aliases: {
		'hat': {
			arg: 'hat',
			list: true,
		},
		'snack': {
			arg: 'snack',
			list: true,
		},
		'hatbuy': {
			arg: 'gacha',
			list: false,
		},
		'buyhat': {
			arg: 'gacha',
			list: false,
		},
	},
	actions: {
		default: {
			say: [
				'Hello! I\'m Hattington, Kiwi\'s stream pet! ' +
				'You can lend me one of your hats, or even give me a snack! ' +
				'To lend me a hat, use the command "!hat <hat-name>". ' +
				'To give me a snack, use the command "!snack <snack-name>". ' +
				'Check the store for how to get hats and snacks!',
			],
		},
		hat: {
			execute(args, tags, message, channel, client) {

				let content = '';
				let bypassCheck = false;

				// If there is no data set...
				if (!('data' in client.overlay.hattington)) {
					client.overlay.hattington.data = [];
				}
				if (!('hat' in client.overlay.hattington.data)) {
					client.overlay.hattington.data.hat = [];
					client.overlay.hattington.data.hat.time = new Date();
					bypassCheck = true;
				}

				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				const timeLimit = client.overlay.hattington.settings.timeBetweenHats;
				const lastHat = new Date(client.overlay.hattington.data.hat.time);
				const now = new Date();
				const minsSince = Math.round((((now - lastHat) % 86400000) % 3600000) / 60000);

				let hat = false;
				// If a hat was passed in...
				if (('2' in args)) {
					hat = message.substr(message.indexOf(args[2])).trim();
				}

				// If no hat, output the current info...
				if (!hat) {
					content = `Hattington is currently wearing the ${client.overlay.hattington.data.hat.hat}, provided by @${client.overlay.hattington.data.hat.twitchUsername}`;
					if (minsSince < timeLimit) {
						content += `! They only recently put it on, so give them a little time! (Roughly ${timeLimit - minsSince} minutes)`;
					}
					else {
						content += ', and it looks like they are ready for a new hat!';
					}
					functions.sayHandler(client, content);
					return;
				}
				// If one was passed...
				else if (hat) {
					if (!bypassCheck) {
						if (minsSince < timeLimit) {
							content = `Hattington is currently wearing the ${client.overlay.hattington.data.hat.hat}, provided by @${client.overlay.hattington.data.hat.twitchUsername}!`;
							content += ` They only recently put it on, so give them a little time! (Roughly ${timeLimit - minsSince} minutes)`;
							functions.sayHandler(client, content);
							return;
						}
					}

					axios.get(client.endpoint + 'overlay/hattington/' + client.userID + '/' + viewerID + '/check/hats/' + encodeURIComponent(hat))
						.then(function(response) {
							const resData = response.data;
							if (resData.status === 'success') {
								content = `@${viewer}, found your hat, giving it to Hattington!`;
								client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'type' : 'hat', 'response': resData.response, 'target': 'hattington' }, 'source': 'komfybot' }));

								// Update the local data..
								client.overlay.hattington.data.hat.time = new Date();
								client.overlay.hattington.data.hat.hat = response.data.response.name;
								client.overlay.hattington.data.hat.twitchUsername = viewer;
								client.overlay.hattington.data.hat.prodData = response.data.response;
							}
							else if (resData.status === 'failure') {
								if (resData.err_msg === 'not_in_inventory') {
									content = `@${viewer}, it looks like you don't have a ${hat} to lend to Hattington.`;
								}
								else if (resData.err_msg === 'couldnt_locate_product') {
									content = `@${viewer}, I couldn't locate a "${hat}" in the store.`;
								}
								else if (resData.err_msg === 'missing_authorization') {
									client.debug.write(client.channel, 'hattington-hat', 'Authorization issue');
								}
								else {
									client.debug.write(client.channel, 'hattington-hat', 'Failed response');
								}
							}
							else {
								client.debug.write(client.channel, 'hattington-hat', 'Not sure how you got here');
							}
						})
						.catch(function() {
							client.debug.write(client.channel, 'hattington-hat', 'Issue while handling command');
						})
						.finally(function() {
							if (!('silent' in tags)) {
								if (content !== '') {
									functions.sayHandler(client, content);
								}
							}
						});

				}
			},
		},
		snack: {
			execute(args, tags, message, channel, client) {

				let content = '';
				let bypassCheck = false;

				// If there is no data set...
				if (!('data' in client.overlay.hattington)) {
					client.overlay.hattington.data = [];
				}
				if (!('snack' in client.overlay.hattington.data)) {
					client.overlay.hattington.data.snack = [];
					client.overlay.hattington.data.snack.time = new Date();
					bypassCheck = true;
				}

				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				const timeLimit = client.overlay.hattington.settings.timeBetweenSnacks;
				const lastSnack = new Date(client.overlay.hattington.data.snack.time);
				const now = new Date();
				const minsSince = Math.round((((now - lastSnack) % 86400000) % 3600000) / 60000);

				let snack = false;
				// If a snack was passed in...
				if (('2' in args)) {
					snack = message.substr(message.indexOf(args[2])).trim();
				}

				// If no snack, output the current info...
				if (!snack) {
					content = `Hattington recently enjoyed ${client.overlay.hattington.data.snack.snack}, provided by @${client.overlay.hattington.data.snack.twitchUsername}`;
					if (minsSince < timeLimit) {
						content += `! Give them a little time to digest! (Roughly ${timeLimit - minsSince} minutes)`;
					}
					else {
						content += ', and it looks like they are ready for another snack!';
					}
					functions.sayHandler(client, content);
					return;
				}
				// If one was passed...
				else if (snack) {
					if (!bypassCheck) {
						if (minsSince < timeLimit) {
							content = `Hattington recently enjoyed ${client.overlay.hattington.data.snack.snack}, provided by @${client.overlay.hattington.data.snack.twitchUsername}!`;
							content += ` Give them a little time to digest! (Roughly ${timeLimit - minsSince} minutes)`;
							functions.sayHandler(client, content);
							return;
						}
					}

					axios.get(client.endpoint + 'overlay/hattington/' + client.userID + '/' + viewerID + '/use/snacks/' + encodeURIComponent(snack))
						.then(function(response) {
							const resData = response.data;
							if (resData.status === 'success') {
								content = `@${viewer}, giving your ${snack} to Hattington! You have ${resData.response.remaining} left.`;
								client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'type' : 'snack', 'response': resData.response, 'target': 'hattington' }, 'source': 'komfybot' }));

								console.log(resData);

								// Update the local data..
								client.overlay.hattington.data.snack.time = new Date();
								client.overlay.hattington.data.snack.snack = response.data.response.name;
								client.overlay.hattington.data.snack.twitchUsername = viewer;
								client.overlay.hattington.data.snack.prodData = response.data.response;
							}
							else if (resData.status === 'failure') {
								if (resData.err_msg === 'not_in_inventory') {
									content = `@${viewer}, it looks like you don't have a ${snack} to give to Hattington.`;
								}
								else if (resData.err_msg === 'couldnt_locate_product') {
									content = `@${viewer}, I couldn't locate a ${snack} in the store.`;
								}
								else if (resData.err_msg === 'missing_authorization') {
									client.debug.write(client.channel, 'hattington-snack', 'Authorization issue');
								}
								else {
									client.debug.write(client.channel, 'hattington-snack', 'Failed response');
								}
							}
							else {
								client.debug.write(client.channel, 'hattington-snack', 'Not sure how you got here');
							}
						})
						.catch(function() {
							client.debug.write(client.channel, 'hattington-snack', 'Issue while handling command');
						})
						.finally(function() {
							if (!('silent' in tags)) {
								if (content !== '') {
									functions.sayHandler(client, content);
								}
							}
						});
				}
			},
		},
		gacha: {
			execute(args, tags, message, channel, client) {

				let amt = '1';
				if ('2' in args) {
					amt = args[2];
				}

				// Setup message to buy the hat...
				const args2 = ['!store', 'buy', 'Gacha', 'Hat', amt ];
				const message2 = `!store buy Gacha Hat ${amt}`;
				tags['silent'] = true;
				client.commands['global'].store.actions.buy.execute(args2, tags, message2, channel, client);
			},
		},
	},
};