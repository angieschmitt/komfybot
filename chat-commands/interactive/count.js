const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'count',
	description: 'Counter for reasons',
	help: 'Outputs the current value of the counter. Additional arguments: set, reset',
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'insert/count/')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `COUNTER: ${output.content}`;
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
		set: {
			help: 'MOD command to fix the amount on the counter. !count set <number:required>',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				if (!args[2]) {
					client.say(channel, 'You forgot your question!');
				}
				else {
					let content = '';
					axios.get(baseUrl + 'insert/count/?set=' + parseInt(args[2]))
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								content = `COUNTER: ${args[2]}`;
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
							}
						})
						.catch(function() {
							content = 'Something went wrong, tell @kittenAngie.';
						})
						.finally(function() {
							client.say(channel, content);
						});
				}
			},
		},
		reset: {
			help: 'MOD command to reset the amount on the counter. !count reset',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'insert/count/?reset')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = 'COUNTER: RESET';
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
	},
};