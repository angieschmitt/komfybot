const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'quote',
	description: 'Quote thing',
	help: 'Pull a quote from our growing database of silliness!',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let id = false;
				let content = '';
				axios.get(baseUrl + 'retrieve/quote/')
					.then(function(response) {
						const output = response.data;
						id = output.id;
						if (output.status === 'success') {
							content = 'Kiwi once said... ' + output.content;
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						if (id === '3') {
							client.say(channel, content);
						}
						client.say(channel, content);
					});
			},
		},
	},
};