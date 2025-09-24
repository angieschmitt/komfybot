const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

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
				axios.get(data.settings.finalUrl + 'flirt/retrieve')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `Hey ${tags.username}, ${resData.response}`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								data.errorMsg.handle(channel, client, 'pickup', 'Authorization issue');
							}
							else {
								data.errorMsg.handle(channel, client, 'pickup', 'Failed response');
							}
						}
						else {
							data.errorMsg.handle(channel, client, 'pickup', 'Not sure how you got here');
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'checkin-brag', 'Issue while handling command');
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
	},
};