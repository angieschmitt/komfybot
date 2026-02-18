const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	name: 'guess',
	help: 'Command to accept guesses. Additional args: list, reset, lock, unlock',
	aliases: {
	},
	actions: {
		default: {
			args: {
				required: [ 1 ],
				error: 'don\'t forgot your guess!',
			},
			execute(args, tags, message, channel, client) {
				const viewer = tags['username'];
				const viewerID = tags['user-id'];
				const guess = message.replace(args[0], '').trim().toLowerCase();

				let content = '';
				axios.get(client.endpoint + 'data/guess/' + client.userID + '/' + viewerID + '/' + guess)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${viewer} guessed ${guess}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'guesses_locked') {
								content = `@${viewer}, it looks like you missed the window to guess!`;
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
		list: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/guess/' + client.userID + '/retrieve')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							const list = JSON.parse(resData.response.content);
							if (Object.keys(list).length) {
								Object.entries(list).forEach(([key, value]) => {
									content += `${key}: ${value} || `;
								});
								content = content.substring(0, (content.length - 3));
							}
							else {
								content = 'Seems like there aren\'t any guesses!';
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
		reset: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/guess/' + client.userID + '/reset')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += 'Guesses have been reset!';
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
		lock: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/guess/' + client.userID + '/lock')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += 'Guesses are now locked!';
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
		unlock: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/guess/' + client.userID + '/unlock')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += 'Guesses are now unlocked!';
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
	},
};