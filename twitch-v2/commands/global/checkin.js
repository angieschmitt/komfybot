const axios = require('axios');

module.exports = {
	name: 'checkin',
	help: 'Command to checkin to a stream.',
	aliases: {
		'ch': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			help: 'Checkin to the stream. !checkin',
			execute(args, tags, message, channel, client) {
				// Get channel and userID
				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				let content = '';
				axios.get(client.endpoint + 'data/checkin/' + client.userID + '/' + viewerID)
					.then(function(response) {

						const resData = response.data;
						const swapText = (resData.response > 1 ? 'checkins' : 'checkin');
						if (resData.status === 'success') {
							content = `Welcome in @${viewer}! You're at ${resData.response} ${swapText}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'already_checked_in') {
								content = `@${viewer}, you're at ${resData.response} ${swapText}, but you've already checked in today.`;
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
		brag: {
			help: 'Brag about how many times you checked in. !checkin brag',
			execute(args, tags, message, channel, client) {
				// Get channel and userID
				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				let content = '';
				axios.get(client.endpoint + 'data/checkin/' + client.userID + '/' + viewerID)
					.then(function(response) {
						const resData = response.data;
						const swapText = (resData.response > 1 ? 'times' : 'time');
						if (resData.status === 'success') {
							content = `@${viewer} has checked in an amazing ${resData.response} ${swapText}!`;
						}
						else if (resData.status === 'failure') {
							// If already checked in, we ignore it here...
							if (resData.err_msg === 'already_checked_in') {
								content = `@${viewer} has checked in an amazing ${resData.response} ${swapText}!`;
							}
							else if (resData.err_msg === 'missing_authorization') {
								// data.errorMsg.handle(channel, client, 'checkin-brag', 'Authorization issue');
							}
							else {
								// data.errorMsg.handle(channel, client, 'checkin-brag', 'Failed response');
							}
						}
						else {
							// data.errorMsg.handle(channel, client, 'checkin-brag', 'Not sure how you got here');
						}
					})
					.catch(function() {
						// data.errorMsg.handle(channel, client, 'checkin-brag', 'Issue while handling command');
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