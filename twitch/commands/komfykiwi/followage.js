const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'followage',
	channel: 'komfykiwi',
	help: 'Shows how long you\'ve been following Kiwi!',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.newUrl + 'followage/retrieve/' + tags['user-id'])
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content += `Hey ${tags['username']}, you've been following Kiwi for ${output.response}!`;
						}
						else {
							content += 'Sorry about that, something went wrong...';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, `${content}`);
					});
			},
		},
	},
};