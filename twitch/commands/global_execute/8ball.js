const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: '8ball',
	help: 'Ask the 8 ball anything!',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				if (!args[1]) {
					client.say(channel, 'You forgot your question!');
				}
				else {
					let content = '';
					axios.get(data.settings.newUrl + '8ball/retrieve/')
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								content = `@${tags.username} the Magic 8 Ball says... ` + output.response;
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
	},
};