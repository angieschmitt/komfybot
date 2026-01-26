const axios = require('axios');

module.exports = {
	name: 'quote',
	help: 'Command to handle quotes. Additional args: add',
	aliases: {
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/quote/' + client.userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if ('twitchUsername' in resData.response) {
								content = `"${resData.response.content}" - @${resData.response.twitchUsername}`;
							}
							else {
								content = `${resData.response.content}`;
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
		add: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			args: {
				required: [ 1 ],
				error: 'don\'t forgot the quote!',
			},
			execute(args, tags, message, channel, client) {

				const viewer = tags['username'];

				let quote = message.replace(args[0], '').replace(args[1], '').trim();

				// If we have an @ reference...
				let referenceUser = false;
				if (quote.lastIndexOf('@') !== -1) {
					referenceUser = quote.substring(quote.lastIndexOf('@') + 1);
					quote = encodeURIComponent(quote.replace('@' + referenceUser, ''));
				}

				let content = '';
				axios.get(client.endpoint + 'data/quote/' + client.userID + '/' + quote + (referenceUser ? '/' + referenceUser : ''))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${viewer}, thanks for adding that quote!`;
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
							client.say(channel, content);
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
							client.say(channel, content);
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
							client.say(channel, content);
						}
					});
			},
		},
	},
};