const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: 'pun',
	help: 'Pull a pun from our growing database of silliness!',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.newUrl + 'pun/retrieve')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = 'Pun Delivery Service: ' + output.response;
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