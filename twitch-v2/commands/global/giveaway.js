const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

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
							functions.sayHandler(client, content);
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
							content = 'Giveaway started! Do !giveaway to enter for your chance to win';

							// If they have the store addon, meaning access to currency...
							if (client.addons.includes(1)) {
								// If the prize IS AN INT, adjust to inlude coin name...
								if (module.exports.isInt(prize)) {
									content += ` ${prize} ${(resData.response.content.prize > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
								}
								// If not, just slap the prize on the end...
								else {
									content += ` ${prize}!`;
								}
							}
							// If not, just slap the prize on the end...
							else {
								content += ` ${prize}!`;
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg == 'giveaway_exists') {
								content = 'Seems like there is already a giveaway running.';
							}
							else if (resData.err_msg == 'missing_prize') {
								content = 'You need to include the prize.';
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
				axios.get(client.endpoint + 'data/giveaway/' + client.userID + '/list')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							const list = resData.response.users;
							if (Object.keys(list).length) {
								content = 'Current entrees: ';
								Object.entries(list).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
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
							functions.sayHandler(client, content);
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
								resData.response.content.prize = 'nothing.';
							}

							content = `Giveaway ended! The winner is ${resData.response.content.users}, winning ${resData.response.content.prize}`;

							// Now.. if the prize IS AN INT... hand out winnings..
							if (module.exports.isInt(resData.response.content.prize)) {

								content += ` ${(resData.response.content.prize > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;

								// Handle coins
								const reason = 'Giveaway';
								const args2 = ['!coins', 'add', resData.response.content.users, resData.response.content.prize, 'reason' ];
								const message2 = `!coins add ${resData.response.content.users} ${resData.response.content.prize} ${reason}`;
								tags['silent'] = true;
								client.commands.global.coins.actions.add.execute(args2, tags, message2, channel, client);
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
							functions.sayHandler(client, content);
						}
					});
			},
		},
	},
	isInt(value) {
		const x = parseFloat(value);
		return !isNaN(value) && (x | 0) === x;
	},
};