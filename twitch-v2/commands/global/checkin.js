const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	name: 'checkin',
	help: 'Command to checkin to a stream',
	allowOffline: false,
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
								client.debug.write(client.channel, 'checkin-default', 'Authorization issue');
							}
							else {
								client.debug.write(client.channel, 'checkin-default', 'Failed response');
							}
						}
						else {
							client.debug.write(client.channel, 'checkin-default', 'Not sure how you got here');
						}
					})
					.catch(function() {
						client.debug.write(client.channel, 'checkin-default', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
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
								client.debug.write(client.channel, 'checkin-brag', 'Authorization issue');
							}
							else {
								client.debug.write(client.channel, 'checkin-brag', 'Failed response');
							}
						}
						else {
							client.debug.write(client.channel, 'checkin-brag', 'Not sure how you got here');
						}
					})
					.catch(function() {
						client.debug.write(client.channel, 'checkin-brag', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
						}
					});
			},
		},
	},
};