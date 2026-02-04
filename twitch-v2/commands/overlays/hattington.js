const axios = require('axios');

module.exports = {
	list: false,
	channel: [ 2 ],
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

				// If there is no data set...
				if (!('data' in client.overlay.hattington)) {
					client.overlay.hattington.data = [];
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
						client.say(channel, `Hattington seems to be enjoying their current hat, give them a little time! (Roughly ${timeLimit - minsSince} minutes)`);
						return;
					}
				}

				let content = '';
				axios.get(client.endpoint + 'overlay/hattington/' + client.userID + '/' + viewerID + '/check/hats/' + hat)
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

				// If there is no data set...
				if (!('data' in client.overlay.hattington)) {
					client.overlay.hattington.data = [];
					client.overlay.hattington.data.snack = [];
					client.overlay.hattington.data.snack.time = new Date();
					bypassCheck = true;
				}

				if (!bypassCheck) {
					const lastSnack = new Date(client.overlay.hattington.data.snack.time);
					const now = new Date();
					const minsSince = Math.round((((now - lastSnack) % 86400000) % 3600000) / 60000);

					const timeLimit = client.overlay.hattington.data.settings.timeBetweenSnacks;
					if (minsSince < timeLimit) {
						client.say(channel, `Hattington seems to be enjoying their last snack, give them a little time! (Roughly ${timeLimit - minsSince} minutes)`);
						return;
					}
				}

				let content = '';
				axios.get(client.endpoint + 'overlay/hattington/' + client.userID + '/' + viewerID + '/use/snacks/' + snack)
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