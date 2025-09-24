const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'pun',
	help: 'Pull a pun from our growing database of silliness!',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.finalUrl + 'pun/retrieve')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = 'Pun Delivery Service: ' + resData.response;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								data.errorMsg.handle(channel, client, 'pun', 'Authorization issue');
							}
							else {
								data.errorMsg.handle(channel, client, 'pun', 'Failed response');
							}
						}
						else {
							data.errorMsg.handle(channel, client, 'pun', 'Not sure how you got here');
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'pun', 'Issue while handling command');
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
	},
};