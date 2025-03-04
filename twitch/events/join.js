const axios = require('axios');
const dataFile = require('../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;
// axios.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
// axios.defaults.headers.common['Pragma'] = 'no-cache';
// axios.defaults.headers.common['Expires'] = '0';

module.exports = {
	eventHandler(channel, username, isSelf) {
		// Get client
		const client = this;

		// Log people joining
		data.debug.write(channel, 'USER_JOIN', username);

		if (isSelf) {
			module.exports.handleSpeak(channel, client);
		}
	},
	handleSpeak(channel, client) {
		channel = channel.replace('#', '');
		const timerInterval = 10000;
		setInterval(
			callApi,
			timerInterval,
			channel,
			client,
		);
	},
};

async function callApi(channel, client) {
	const response = await axios({ url: data.settings.finalUrl + 'speak/retrieve/' + channel })
		.catch(function(error) {
			data.debug.write(channel, 'SPEAK_ERROR', error.toJSON());
		});
	if (response) {
		if (response.data.status === 'success') {
			const botSpeak = data.functions.speakConvertor(response.data.response);
			client.say(channel, botSpeak)
				.then(() => {
					axios.get(data.settings.finalUrl + 'speak/remove/' + channel);
				})
				.catch(err => console.log(err));
		}
	}
}