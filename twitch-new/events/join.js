const axios = require('axios');
const dataFile = require('../data/index');
const data = dataFile.content();

module.exports = {
	eventHandler(channel, username, isSelf) {
		// Get client
		const client = this;

		if (isSelf) {
			module.exports.handleSpeak(channel, client);
			data.debug.write('JOINED: ' + channel);
		}
	},
	handleSpeak(channel, client) {
		channel = channel.replace('#', '');
		const timerInterval = 2000;
		setInterval(
			callApi,
			timerInterval,
			channel,
			client,
		);
	},
};

async function callApi(channel, client) {
	const response = await axios({ url: data.settings.newUrl + 'speak/retrieve/' + channel })
		.catch(function(error) {
			data.debug.write('SPEAK ERROR: ');
			data.debug.write(error.toJSON());
		});
	if (response.data.status === 'success') {
		const botSpeak = data.functions.speakConvertor(response.data.response);
		client.say(channel, botSpeak)
			.then(() => {
				axios.get(data.settings.newUrl + 'speak/remove/' + channel);
			});
	}
}