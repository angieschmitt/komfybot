const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'pickup',
	help: 'Ooo-la-la, I am zee pickup line queen...',
	aliases: {
		'flirt': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(baseUrl + 'retrieve/pickup/')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `Hey ${tags.username}, ${output.content}`;
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