const axios = require('axios');

module.exports = {
	name: 'giveaway',
	help: 'Command to interact with the giveaway. Additional arguments: start, end',
	aliases: {
		'g': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				// const streamer = channel.replace('#', '');
				const viewer = tags['username'];
				const viewerID = tags['user-id'];

				let content = '';
				axios.get(client.endpoint + 'data/giveaway/' + client.userID + '/' + viewerID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${viewer}, you've been entered into the giveaway!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'no_giveaway_exists') {
								content = `@${viewer}, seems like there isn't a giveaway running right now.`;
							}
							else if (resData.err_msg == 'already_entered') {
								content = `@${viewer}, seems like you've already entered this giveaway!`;
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
							client.say(channel, content).catch(() => {
								setTimeout(() => {
									client.say(channel, content);
								}, 2500);
							});
						}
					});
			},
		},
		start: {
			execute(args, tags, message, channel, client) {
				let content = '';
				const prize = message.replace(args[0], '').replace(args[1], '').trim().toLowerCase();
				axios.get(client.endpoint + 'data/giveaway/' + client.userID + '/start/' + prize)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `Giveaway started! Do !giveaway to enter for your chance to win ${prize}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'giveaway_exists') {
								content = 'Seems like there is already a giveaway running.';
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
							client.say(channel, content).catch(() => {
								setTimeout(() => {
									client.say(channel, content);
								}, 2500);
							});
						}
					});
			},
		},
		list: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/giveaway/' + client.userID + '/list')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							const list = resData.response.users;
							if (Object.keys(list).length) {
								content = 'Current entrees: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(list).forEach(([key, value]) => {
									content += `@${value} || `;
								});
								content = content.substring(0, (content.length - 3));
							}
							else {
								content = 'Seems like there aren\'t any entries!';
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'no_giveaway_exists') {
								content = 'Seems like there is not a giveaway running.';
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
							client.say(channel, content).catch(() => {
								setTimeout(() => {
									client.say(channel, content);
								}, 2500);
							});
						}
					});
			},
		},
		end: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/giveaway/' + client.userID + '/end')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {

							// If a winner, slap a @ on it...
							if (resData.response.content.users != 'nobody') {
								resData.response.content.users = '@' + resData.response.content.users;
							}
							// If not, nothing the prize...
							else {
								resData.response.content.prize = 'nothing';
							}
							content = `Giveaway ended! The winner is ${resData.response.content.users}, winning ${resData.response.content.prize}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'no_giveaway_exists') {
								content = 'Seems like there is not a giveaway running.';
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
							client.say(channel, content).catch(() => {
								setTimeout(() => {
									client.say(channel, content);
								}, 2500);
							});
						}
					});
			},
		},
	},
};