const axios = require('axios');
const dataFile = require('../data/index');
const data = dataFile.content();

module.exports = {
	eventHandler(channel, username, isSelf) {
		// Get client
		const client = this;

		if (isSelf) {
			// if (channel === '#komfykiwi') {
			// 	// client.say('komfykiwi', 'I\'m here boss! Got my cocoa and blankie!');
			// }
			module.exports.handleSpeak(channel, client);
		}
	},
	handleSpeak(channel, client) {
		channel = channel.replace('#', '');
		const timerInterval = 1000;
		setInterval(
			function() {
				axios.get(data.settings.newUrl + 'speak/retrieve/' + channel)
					.then(function(response) {
						if (response.data.status === 'success') {
							const botSpeak = module.exports.speakConvertor(response.data.response);
							client.say(channel, botSpeak)
								.then(() => {
									axios.get(data.settings.newUrl + 'speak/remove/' + channel);
								});
						}
					});
			},
			timerInterval,
		);
	},
	speakConvertor(data) {
		const letters = {
			'a': 'ᴀ',
			'b': 'ʙ',
			'c': 'ᴄ',
			'd': 'ᴅ',
			'e': 'ᴇ',
			'f': 'ꜰ',
			'g': 'ɢ',
			'h': 'ʜ',
			'i': 'ɪ',
			'j': 'ᴊ',
			'k': 'ᴋ',
			'l': 'ʟ',
			'm': 'ᴍ',
			'n': 'ɴ',
			'o': 'ᴏ',
			'p': 'ᴘ',
			'q': 'Q',
			'r': 'ʀ',
			's': 'ꜱ',
			't': 'ᴛ',
			'u': 'ᴜ',
			'v': 'ᴠ',
			'w': 'ᴡ',
			'x': 'x',
			'y': 'ʏ',
			'z': 'ᴢ',
		};

		const parts = data.toLowerCase().split('');

		let i = 0;
		let newString = '';
		while (i < parts.length) {
			if (letters[parts[i]] !== undefined) {
				newString += letters[ parts[i] ];
			}
			else {
				newString += parts[i];
			}
			i++;
		}

		return newString;
	},
};