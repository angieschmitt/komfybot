const dataFile = require('../../data/index');
const data = dataFile.content();

const axios = require('axios');

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
					const cardName = args.join(' ').replace('!scry', '');
					axios.get('https://api.scryfall.com/cards/named?fuzzy=' + cardName.toLowerCase())
						.then(function(response) {
							const resData = response.data;

							if (resData.object === 'card') {
								output += `${resData.name}: `;
								if (resData.mana_cost !== '') {
									output += `Mana :: ${resData.mana_cost} || `;
								}
								output += `Type :: ${resData.type_line} || `;
								if (resData.oracle_text !== '') {
									output += `Text :: ${resData.oracle_text} || `;
								}
								if ('power' in resData || 'toughness' in resData) {
									output += 'P/T :: ';
									if ('power' in resData) {
										output += `${resData.power}`;
									}
									if ('power' in resData && 'toughness' in resData) {
										output += '/';
									}
									if ('toughness' in resData) {
										output += `${resData.toughness}`;
									}
									output += ' || ';
								}
								if ('gatherer' in resData.related_uris) {
									output += `More Info :: ${resData.related_uris.gatherer} || `;
								}
								output = output.substring(0, (output.length - 4));
							}
						})
						.catch(function(error) {
							const resData = error.response.data;
							if (resData.object == 'error') {
								if (resData.details != '') {
									data.errorMsg.handle(channel, client, 'scryfall', resData.details);
								}
								else {
									data.errorMsg.handle(channel, client, 'scryfall', 'Scryfall API issue');
								}
							}
							else {
								data.errorMsg.handle(channel, client, 'scryfall', 'Failed response');
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