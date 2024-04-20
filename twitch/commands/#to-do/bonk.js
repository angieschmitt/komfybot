const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'bonk',
	help: 'Bonk the streamer. Additional arguments: set (mod), reset (mod)',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'insert/bonks/')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content += `BOP BOP @${channel} got bonked by ${tags.username} || `;
							content += `They've been bonked ${output.content} times!`;
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
					axios.get(baseUrl + 'insert/bonks/?set=' + parseInt(args[2]))
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								content = `Set bonks to ${args[2]}`;
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
				axios.get(baseUrl + 'insert/bonks/?reset')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = 'Reset the bonks';
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