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

				const viewer = tags['username'];
				const viewerID = tags['user-id'];
				const hat = message.substr(message.indexOf(args[2])).trim();

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

				if (!bypassCheck) {
					const lastHat = new Date(client.overlay.hattington.data.hat.time);
					const now = new Date();
					const minsSince = Math.round((((now - lastHat) % 86400000) % 3600000) / 60000);

					const timeLimit = client.overlay.hattington.settings.timeBetweenHats;
					if (minsSince < timeLimit) {
						content = `Hattington seems to be enjoying their current hat, give them a little time! (Roughly ${timeLimit - minsSince} minutes)`;
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
							client.overlay.hattington.data.hat.time = new Date();
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
			},
		},
		snack: {
			execute(args, tags, message, channel, client) {

				let content = '';

				const viewer = tags['username'];
				const viewerID = tags['user-id'];
				const snack = message.substr(message.indexOf(args[2])).trim();

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

				if (!bypassCheck) {
					const lastSnack = new Date(client.overlay.hattington.data.snack.time);
					const now = new Date();
					const minsSince = Math.round((((now - lastSnack) % 86400000) % 3600000) / 60000);

					const timeLimit = client.overlay.hattington.settings.timeBetweenSnacks;
					if (minsSince < timeLimit) {
						content = `Hattington seems to be enjoying their last snack, give them a little time! (Roughly ${timeLimit - minsSince} minutes)`;
						functions.sayHandler(client, content);
						return;
					}
				}

				axios.get(client.endpoint + 'overlay/hattington/' + client.userID + '/' + viewerID + '/use/snacks/' + encodeURIComponent(snack))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${viewer}, found your snack, giving it to Hattington! You have ${resData.response.remaining} left.`;
							client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'type' : 'snack', 'response': resData.response, 'target': 'hattington' }, 'source': 'komfybot' }));
							client.overlay.hattington.data.snack.time = new Date();
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

			},
		},
	},
};