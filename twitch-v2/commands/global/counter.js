const axios = require('axios');

const settingsFile = require('../../settings');
const settings = settingsFile.content();

module.exports = {
	name: 'counter',
	help: 'Command to bonk someone',
	aliases: {
		'count': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(settings.endpoint + 'data/counter/' + client.userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `COUNTER: ${resData.response}`;
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
		set: {
			execute(args, tags, message, channel, client) {
				let content = '';

				if (!args[2]) {
					client.say(channel, 'Please provide a value!');
					return;
				}

				axios.get(settings.endpoint + 'data/counter/' + client.userID + '/set/' + args[2])
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `COUNTER: ${resData.response}`;
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
		reset: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(settings.endpoint + 'data/counter/' + client.userID + '/reset')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `COUNTER: ${resData.response}`;
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
	},
};