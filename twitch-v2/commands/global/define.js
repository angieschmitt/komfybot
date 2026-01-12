const axios = require('axios');

module.exports = {
	list: false,
	name: 'define',
	help: 'Provides a definition for a word',
	aliases: {
		'def': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let output = '';

				if (!args[1]) {
					client.say(channel, 'Please provide a word to define!');
				}
				else {
					const lookup = args[1].trim().toLowerCase();

					axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + lookup)
						.then(function(response) {
							const resData = response.data;

							if (message in resData) {
								if (resData.message == 'Sorry pal, we couldn\'t find definitions for the word you were looking for.') {
									output = `Sorry @${tags.username}, we couldn't find definitions for the word you were looking for.`;
								}
							}
							else {
								output = `@${tags.username}, ${lookup} can be defined as a... `;
								const meanings = resData[0].meanings;
								Object.entries(meanings).forEach(([key]) => {
									output += `${meanings[key].partOfSpeech} : ${meanings[key].definitions[0].definition} || `;
								});

								output = output.substring(0, output.length - 3).trim();

								if (resData[0].phonetic) {
									output += ` It is pronounced like: ${resData[0].phonetic}`;
								}
							}
						})
						.catch(function(caught) {
							const resData = caught.response.data;
							if (resData.message == 'Sorry pal, we couldn\'t find definitions for the word you were looking for.') {
								output = `Sorry @${tags.username}, we couldn't find definitions for the word you were looking for.`;
							}
						})
						.finally(function() {
							if (output !== '') {
								client.say(channel, output);
							}
						});
				}
			},
		},
	},
};