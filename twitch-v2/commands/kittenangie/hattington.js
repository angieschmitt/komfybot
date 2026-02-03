const axios = require('axios');

module.exports = {
	list: false,
	channel: ['1'],
	name: 'hatty',
	help: 'Commands for Hattington',
	aliases: {
		'hat': {
			arg: 'hat',
			list: false,
		},
		'snack': {
			arg: 'snack',
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

				const viewer = tags['username'];
				const viewerID = tags['user-id'];
				const hat = encodeURIComponent(message.substr(message.indexOf(args[2])).trim());

				let bypassCheck = false;

				// Gotta set something up in the client to track timers...
				if (!('overlay' in client)) {
					client.overlay = [];
				}
				// If hattington isn't set...
				if (!('hattington' in client.overlay)) {
					client.overlay.hattington = [];
				}
				// If the hat timer is not set...
				if (!('hat' in client.overlay.hattington)) {
					client.overlay.hattington.hat =	new Date();
					bypassCheck = true;
				}

				if (!bypassCheck) {
					const lastHat = client.overlay.hattington.hat;
					const now = new Date();
					const minsSince = Math.round((((now - lastHat) % 86400000) % 3600000) / 60000);

					// MOVE TIME LIMITS TO DASHBOARD
					const timeLimit = 10;
					if (minsSince < timeLimit) {
						client.say(channel, `Hattington seems to be enjoying their current hat, give them a little time! (Roughly ${timeLimit - minsSince} minutes)`);
						return;
					}
				}

				let content = '';
				axios.get(client.endpoint + 'overlay/hattington/' + 2 + '/' + viewerID + '/check/hats/' + hat)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${viewer}, found your hat, giving it to Hattington!`;
							client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'type' : 'hat', 'response': resData.response, 'target': 'hattington' }, 'source': 'komfybot' }));
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'not_in_inventory') {
								content = `@${viewer}, it looks like you don't have a ${hat} to lend to Hattington.`;
							}
							else if (resData.err_msg === 'couldnt_locate_product') {
								content = `@${viewer}, I couldn't locate a ${hat} in the store.`;
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
						if (!('silent' in tags)) {
							if (content !== '') {
								client.say(channel, content);
							}
						}
					});

			},
		},
		snack: {
			execute(args, tags, message, channel, client) {

				const viewer = tags['username'];
				const viewerID = tags['user-id'];
				const snack = encodeURIComponent(message.substr(message.indexOf(args[2])).trim());

				let bypassCheck = false;

				// Gotta set something up in the client to track timers...
				if (!('overlay' in client)) {
					client.overlay = [];
				}
				// If hattington isn't set...
				if (!('hattington' in client.overlay)) {
					client.overlay.hattington = [];
				}
				// If the hat timer is not set...
				if (!('snack' in client.overlay.hattington)) {
					client.overlay.hattington.snack = new Date();
					bypassCheck = true;
				}

				if (!bypassCheck) {
					const lastSnack = client.overlay.hattington.snack;
					const now = new Date();
					const minsSince = Math.round((((now - lastSnack) % 86400000) % 3600000) / 60000);

					// MOVE TIME LIMITS TO DASHBOARD
					const timeLimit = 5;
					if (minsSince < timeLimit) {
						client.say(channel, `Hattington seems to be enjoying their last snack, give them a little time! (Roughly ${timeLimit - minsSince} minutes)`);
						return;
					}
				}

				let content = '';
				axios.get(client.endpoint + 'overlay/hattington/' + 2 + '/' + viewerID + '/use/snacks/' + snack)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${viewer}, found your snack, giving it to Hattington! You have ${resData.response.remaining} left.`;
							client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'type' : 'snack', 'response': resData.response, 'target': 'hattington' }, 'source': 'komfybot' }));
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'not_in_inventory') {
								content = `@${viewer}, it looks like you don't have a ${snack} to give to Hattington.`;
							}
							else if (resData.err_msg === 'couldnt_locate_product') {
								content = `@${viewer}, I couldn't locate a ${snack} in the store.`;
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
						if (!('silent' in tags)) {
							if (content !== '') {
								client.say(channel, content);
							}
						}
					});

			},
		},
	},
};