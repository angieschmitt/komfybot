const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

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
					axios.get(data.settings.finalUrl + '8ball/retrieve/')
						.then(function(response) {
							const resData = response.data;
							if (resData.status === 'success') {
								content = `@${tags.username} the Magic 8 Ball says... ` + resData.response;
							}
							else if (resData.status === 'failure') {
								if (resData.err_msg === 'missing_authorization') {
									data.errorMsg.handle(channel, client, '8ball', 'Authorization issue');
								}
								else {
									data.errorMsg.handle(channel, client, '8ball', 'Failed response');
								}
							}
						})
						.catch(function() {
							data.errorMsg.handle(channel, client, '8ball', 'Issue while handling command');
						})
						.finally(function() {
							if (content !== '') {
								client.say(channel, content);
							}
						});
				}
			},
		},
	},
};