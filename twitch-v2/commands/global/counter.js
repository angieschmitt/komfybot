const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	name: 'counter',
	help: 'Command to count something',
	aliases: {
		'count': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			perms: {
				levels: ['streamer', 'mod'],
				error: 'this command is for the streamer and mods only.',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/counter/' + client.userID)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `COUNTER: ${resData.response}`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								client.debug.write(channel, 'counter-default', 'Authorization issue');
							}
							else {
								client.debug.write(channel, 'counter-default', 'Failed response');
							}
						}
						else {
							client.debug.write(channel, 'counter-default', 'Not sure how you got here');
						}
					})
					.catch(function() {
						client.debug.write(channel, 'counter-default', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
						}
					});

			},
		},
		set: {
			perms: {
				levels: ['streamer', 'mod'],
				error: 'this command is for the streamer and mods only.',
			},
			args: {
				required: [ 2 ],
				error: 'don\'t forgot the amount!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/counter/' + client.userID + '/set/' + args[2])
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `COUNTER: ${resData.response}`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								client.debug.write(channel, 'counter-set', 'Authorization issue');
							}
							else {
								client.debug.write(channel, 'counter-set', 'Failed response');
							}
						}
						else {
							client.debug.write(channel, 'counter-set', 'Not sure how you got here');
						}
					})
					.catch(function() {
						client.debug.write(channel, 'counter-set', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							functions.sayHandler(client, content);
						}
					});

			},
		},
		reset: {
			perms: {
				levels: ['streamer', 'mod'],
				error: 'this command is for the streamer and mods only.',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(client.endpoint + 'data/counter/' + client.userID + '/reset')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `COUNTER: ${resData.response}`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								client.debug.write(channel, 'counter-reset', 'Authorization issue');
							}
							else {
								client.debug.write(channel, 'counter-reset', 'Failed response');
							}
						}
						else {
							client.debug.write(channel, 'counter-reset', 'Not sure how you got here');
						}
					})
					.catch(function() {
						client.debug.write(channel, 'counter-reset', 'Issue while handling command');
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