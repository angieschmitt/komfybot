const axios = require('axios');

module.exports = {
	name: 'coins',
	help: 'Command to interact with coins. Additional args: add',
	addon: 1,
	aliases: {
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				// Setup who we're looking up...
				let target = tags['username'];
				if (args.length > 1 && args[1] !== tags.username) {
					target = args[1].replace('@', '');
				}

				const viewer = tags['username'];

				let content = '';
				axios.get(client.endpoint + 'coins/retrieve/' + client.userID + '/' + target)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							// Format based on target...
							if (viewer == target) {
								content = `Hey @${viewer}, you have ${resData.response} ${(resData.response > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)} in your wallet.`;
							}
							else {
								content = `Hey @${viewer}, ${target} has ${resData.response} ${((resData.response > 1 || resData.response == 0) ? client.settings.currency.name.plural : client.settings.currency.name.single)} in their wallet.`;
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
				levels: ['streamer', 'mod'],
				error: 'this command is for the streamer and mods only.',
			},
			args: {
				required: [ 2, 3 ],
				error: 'don\'t forgot the user and the amount!',
			},
			execute(args, tags, message, channel, client) {

				const target = args[2].replace('@', '');
				const amount = args[3];
				if (!module.exports.isInt(amount)) {
					client.say(channel, 'The amount goes after the username');
					return;
				}

				let reason = message.replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();
				reason = encodeURIComponent(reason);

				let content = '';
				axios.get(client.endpoint + 'coins/insert/' + client.userID + '/' + target + '/' + amount + '/' + reason)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `Congrats @${target} on adding ${amount} ${(amount > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)} to your wallet.`;
							content += ` You have a total of ${resData.response} ${(resData.response > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
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
	isInt(value) {
		const x = parseFloat(value);
		return !isNaN(value) && (x | 0) === x;
	},
};