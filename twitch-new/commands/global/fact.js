const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	list: false,
	name: 'factoftheday',
	help: 'Displays the fact of the day!',
	aliases: {
		'fact': {
			args: false,
			list: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'retrieve/fact/')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `@${tags.username} the Fact of the Day is... ` + output.content;
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