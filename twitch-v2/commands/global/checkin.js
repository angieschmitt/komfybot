const axios = require('axios');

const settingsFile = require('../../settings');
const settings = settingsFile.content();

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

				// Setup JSON to pass through
				const jsonData = { 'userID': client.userID, 'viewerID': viewerID };

				let content = '';
				axios.get(settings.endpoint + 'checkin/insert/' + encodeURIComponent(JSON.stringify(jsonData)))
					.then(function(response) {
						const resData = response.data;
						console.log(resData);
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

				// Setup JSON to pass through
				const jsonData = { 'userID': client.userID, 'viewerID': viewerID };

				let content = '';
				axios.get(settings.endpoint + 'checkin/retrieve/' + encodeURIComponent(JSON.stringify(jsonData)))
					.then(function(response) {
						const resData = response.data;
						const swapText = (resData.response > 1 ? 'times' : 'time');
						if (resData.status === 'success') {
							content = `@${viewer} has checked in ${resData.response} ${swapText}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
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