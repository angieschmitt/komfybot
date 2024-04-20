const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'uptime',
	help: 'Check how long the streamer\'s been online. ',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'retrieve/uptime')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `@${channel.replace('#', '')} has been live for: ` + output.content;
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
		reset: {
			help: 'MOD command to reset the uptime counter. !uptime reset',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'insert/uptime')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = 'Uptime RESET';
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