const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	list: false,
	name: 'followage',
	channel: 'komfykiwi',
	help: 'Shows how long you\'ve been following Kiwi!',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.finalUrl + 'followage/retrieve/' + tags['user-id'])
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `Hey ${tags['username']}, you've been following Kiwi for ${resData.response}!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie 3.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie 2.';
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