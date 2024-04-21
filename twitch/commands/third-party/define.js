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
				else if (args[1] === 'nerd') {
					output = `@${tags.username}, ${args[1]} can be defined as a... noun : (sometimes derogatory) A person who is intellectual but generally introverted. See @MrDrXMan .`;
					client.say(channel, output);
				}
				else {
					axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + args[1])
						.then(function(response) {
							const data = response.data;

							output = `@${tags.username}, ${args[1]} can be defined as a... `;
							const meanings = data[0].meanings;
							Object.entries(meanings).forEach(([key]) => {
								output += `${meanings[key].partOfSpeech} : ${meanings[key].definitions[0].definition} || `;
							});

							output = output.substring(0, output.length - 3).trim();

							if (data[0].phonetic) {
								output += ` It is pronounced like: ${data[0].phonetic}`;
							}
						})
						.catch(function(caught) {
							const data = caught.response.data;
							if (data.message == 'Sorry pal, we couldn\'t find definitions for the word you were looking for.') {
								output = `Sorry @${tags.username}, we couldn't find definitions for the word you were looking for.`;
							}
							else {
								output = 'Something went wrong, tell @kittenAngie.';
							}
						})
						.finally(function() {
							client.say(channel, output);
						});
				}
			},
		},
	},
};