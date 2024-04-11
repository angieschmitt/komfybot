const axios = require('axios');
// const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

module.exports = {
	name: 'scry',
	help: 'Scryfall powered card lookup, requires a card name.',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let output = '';
				if (!args[1]) {
					client.say(channel, 'Please provide a card to lookup!');
				}
				else {
					const cardName = message.replace(args[0], '').trim();
					axios.get('https://api.scryfall.com/cards/named?fuzzy=' + cardName.toLowerCase())
						.then(function(response) {
							const data = response.data;

							output += `${data.name}: `;
							if (data.mana_cost !== '') {
								output += `Mana :: ${data.mana_cost} || `;
							}
							output += `Type :: ${data.type_line} || `;
							if (data.oracle_text !== '') {
								output += `Text :: ${data.oracle_text} || `;
							}
							if ('power' in data || 'toughness' in data) {
								output += 'P/T :: ';
								if ('power' in data) {
									output += `${data.power}`;
								}
								if ('power' in data && 'toughness' in data) {
									output += '/';
								}
								if ('toughness' in data) {
									output += `${data.toughness}`;
								}
								output += ' || ';
							}
							if ('gatherer' in data.related_uris) {
								output += `More Info :: ${data.related_uris.gatherer} || `;
							}
							output = output.substring(0, (output.length - 4));
						})
						.catch(function() {
							output = 'Something went wrong, tell @kittenAngie.';
						})
						.finally(function() {
							client.say(channel, output);
						});
				}
			},
		},
	},
};