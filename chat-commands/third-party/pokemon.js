const axios = require('axios');

module.exports = {
	name: 'pkmn',
	description: 'PokeAPI pkmn search',
	help: 'PokeAPI powered pokemon lookup, requires a name. Additional args: evolve',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let output = '';
				if (!args[1]) {
					client.say(channel, 'Please provide a pokemon to lookup!');
				}
				else {
					axios.get('https://pokeapi.co/api/v2/pokemon-species/' + args[1].toLowerCase())
						.then(function(response) {
							const data = response.data;

							const flavorTexts = [];
							data.flavor_text_entries.forEach(item => {
								if (item.language.name === 'en') {
									flavorTexts.push(item.flavor_text);
								}
							});

							let flavorText = flavorTexts[ randomIntFromInterval(0, (flavorTexts.length - 1)) ];
							flavorText = flavorText.replace('\f', '\n')
								.replace('\u00ad\n', '')
								.replace('\u00ad', '')
								.replace(' -\n', ' - ')
								.replace('-\n', '-')
								.replace('\n', ' ');

							let natDex = 0;
							data.pokedex_numbers.forEach(dex => {
								if (dex.pokedex.name === 'national') {
									natDex = dex.entry_number;
								}
							});

							let genus = '';
							data.genera.forEach(genera => {
								if (genera.language.name === 'en') {
									genus = genera.genus;
								}
							});

							output = `${ucwords(args[1])}, National Dex #${natDex}, the ${genus}. `;
							output += `${ flavorText }`;
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
		evolve: {
			help: 'Gives evolution info for the pokemon. !pkmn evolve <pokemon-name:required>',
			execute(args, tags, message, channel, client) {
				let output = '';
				if (!args[2]) {
					client.say(channel, 'Please provide a pokemon to lookup!');
				}
				else {
					let evoTree = false;
					axios.get('https://pokeapi.co/api/v2/pokemon-species/' + args[2].toLowerCase())
						.then(function(response) {
							const data = response.data;
							evoTree = data.evolution_chain.url;
						})
						.catch(function() {
							// const data = caught.response.data;
							output = 'Something went wrong, tell @kittenAngie.';
						})
						.finally(function() {

							if (evoTree) {
								axios.get(evoTree)
									.then(function(response2) {
										const data2 = response2.data;
										const pkmn = ucwords(data2.chain.species.name);

										if (data2.chain.evolves_to.length > 0) {
											output = buildEvolutionDetails(data2.chain.evolves_to, pkmn);
										}
										else {
											output += `${pkmn} does not have any evolutions. `;
										}

										client.say(channel, `${output}`);
									})
									.catch(function() {
										// const data = caught.response.data;
										client.say(channel, '2Something went wrong, tell @kittenAngie.');
									});
							}
							else {
								client.say(channel, output);
							}
						});

					// !pkmn evolve eevee
				}
			},
		},
		stats: {
			help: 'Gives stat info for the pokemon. !pkmn evolve <pokemon-name:required>',
			execute(args, tags, message, channel, client) {
				let output = '';
				if (!args[2]) {
					client.say(channel, 'Please provide a pokemon to lookup!');
				}
				else {
					let stats = false;
					axios.get('https://pokeapi.co/api/v2/pokemon/' + args[2].toLowerCase())
						.then(function(response) {
							const data = response.data;
							stats = data.stats;
						})
						.catch(function() {
							// const data = caught.response.data;
							output = 'Something went wrong, tell @kittenAngie.';
						})
						.finally(function() {

							if (stats) {
								const pkmn = ucwords(args[2]);
								const statList = { 'hp': '', 'atk': '', 'def': '', 'sp-atk': '', 'sp-def': '', 'spd': '' };
								for (let index = 0; index < stats.length; index++) {
									Object.entries(stats[index]).forEach(([key, value]) => {
										if (key === 'stat') {
											let ref = '';
											switch (value['name']) {
											case 'hp':
												ref = 'hp';
												break;
											case 'attack':
												ref = 'atk';
												break;
											case 'defense':
												ref = 'def';
												break;
											case 'special-attack':
												ref = 'sp-atk';
												break;
											case 'special-defense':
												ref = 'sp-def';
												break;
											case 'speed':
												ref = 'spd';
												break;
											default:
												break;
											}
											statList[ref] = stats[index]['base_stat'];
										}
									});
								}

								output += `${pkmn} has the following base stats: `;
								Object.entries(statList).forEach(([key, value]) => {
									output += `${key} : ${value} || `;
								});
								output = output.substring(0, output.length - 3).trim();

								client.say(channel, output);
							}
							else {
								client.say(channel, output);
							}
						});
				}
			},
		},
	},
};

function ucwords(string) {
	return string.toLowerCase().replace(/(?<= )[^\s]|^./g, a => a.toUpperCase());
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function buildEvolutionDetails(data, pkmn) {

	const methods = [];
	data.forEach(level1 => {
		const thisEvo = ucwords(level1.species.name);
		methods[thisEvo] = [];
		methods[thisEvo]['locations'] = [];

		const details = level1.evolution_details;
		Object.entries(details).forEach(([id, inner]) => {
			methods[thisEvo][id] = [];
			Object.entries(inner).forEach(([key, info]) => {
				if (info !== null && info !== false && info !== '') {
					if (typeof info === 'object') {
						if (key === 'trigger') {
							methods[thisEvo][id][key] = info.name;
						}
						else if (key === 'location') {
							methods[thisEvo][id]['uses-locations'] = true;
							methods[thisEvo]['locations'].push(ucwords(info.name.replaceAll('-', ' ')));
						}
						else {
							methods[thisEvo][id][key] = ucwords(info.name.replace('-', ' '));
						}
					}
					else {
						methods[thisEvo][id][key] = info;
					}
				}
			});
		});

		level1.evolves_to.forEach(level2 => {
			const thisEvo2 = ucwords(level2.species.name);
			methods[thisEvo2] = [];
			methods[thisEvo2]['previous'] = thisEvo;
			methods[thisEvo2]['locations'] = [];

			const details2 = level2.evolution_details;
			Object.entries(details2).forEach(([id, inner]) => {
				methods[thisEvo2][id] = [];
				Object.entries(inner).forEach(([key, info]) => {
					if (info !== null && info !== false && info !== '') {
						if (typeof info === 'object') {
							if (key === 'trigger') {
								methods[thisEvo2][id][key] = info.name;
							}
							else if (key === 'location') {
								methods[thisEvo2][id]['uses-locations'] = true;
								methods[thisEvo2]['locations'].push(ucwords(info.name.replaceAll('-', ' ')));
							}
							else {
								methods[thisEvo2][id][key] = ucwords(info.name.replace('-', ' '));
							}
						}
						else {
							methods[thisEvo2][id][key] = info;
						}
					}
				});
			});
		});
	});

	const output = [];
	Object.entries(methods).forEach(([evolution, methodData]) => {
		output[evolution] = '';

		methodData.forEach(function(item, index, object) {
			if (item['uses-locations']) {
				object.splice(index, 1);
			}
		});

		let out = '';
		methodData.forEach(loop => {
			if (output[evolution] === '') {
				out += `${(methodData['previous'] ? methodData['previous'] : pkmn)}`;
				out += `${(loop['gender'] ? (loop['gender'] == 1 ? ', if female,' : ', if male,') : '')}`;
				out += ' evolves';
				out += ` into ${evolution}`;
				out += `${(loop['trigger'] === 'level-up' ? ' when leveled up' : '')}`;
				out += `${(loop['trigger'] === 'trade' ? ' when traded' : '')}`;
				out += `${(loop['trigger'] === 'shed' ? ' by shedding' : '')}`;
				out += `${(loop['trigger'] === 'take-damage' ? ' when taking damage' : '')}`;
				out += `${(loop['time_of_day'] ? ' during the ' + loop['time_of_day'] : '')}`;
				out += `${(loop['min_level'] ? ` to level ${loop['min_level']}` : '')}`;
				out += `${(loop['held_item'] ? ' while holding ' + loop['held_item'] : '')}`;
				out += `${(loop['item'] ? ' with a ' + loop['item'] : '')}`;
				out += `${(loop['known_move'] ? ' while knowing ' + loop['known_move'] : '')}`;
				out += `${(loop['known_move_type'] ? ' while knowing a ' + loop['known_move_type'] + ' type move' : '')}`;
				out += `${(loop['min_affection'] ? ' while having a minimum of ' + loop['min_affection'] + ' affection' : '')}`;
				out += `${(loop['min_beauty'] ? ' while having a minimum of ' + loop['min_beauty'] + ' beauty' : '')}`;
				out += `${(loop['min_happiness'] ? ' while having a minimum of ' + loop['min_happiness'] + ' happiness' : '')}`;
				out += `${(loop['needs_overworld_rain'] ? ' while it\'s raining' : '')}`;
				out += `${(loop['party_species'] ? ' while having a ' + loop['party_species'] + ' in the party' : '')}`;
				out += `${(loop['party_type'] ? loop['party_type'] : '')}`;
				out += `${(loop['relative_physical_stats'] ? loop['relative_physical_stats'] : '')}`;
				out += `${(loop['trade_species'] ? ' while trading a ' + loop['party_species'] + ' in the party' : '')}`;
				out += `${(loop['turn_upside_down'] ? ' while it\'s upside down' : '')}`;
				if (methodData.locations.length > 0) {
					out += ` at the following locations: ${Object.values(methodData.locations).join(', ')}`;
				}
			}
			else {
				out += ', or';
				out += `${(loop['trigger'] === 'level-up' ? ' when leveled up' : '')}`;
				out += `${(loop['trigger'] === 'trade' ? ' when traded' : '')}`;
				out += `${(loop['time_of_day'] ? ' during the ' + loop['time_of_day'] : '')}`;
				out += `${(loop['min_level'] ? ` to level ${loop['min_level']}` : '')}`;
				out += `${(loop['held_item'] ? ' while holding ' + loop['held_item'] : '')}`;
				out += `${(loop['item'] ? ' with a ' + loop['item'] : '')}`;
				out += `${(loop['known_move'] ? ' while knowing ' + loop['known_move'] : '')}`;
				out += `${(loop['known_move_type'] ? ' while knowing a ' + loop['known_move_type'] + ' type move' : '')}`;
				out += `${(loop['min_affection'] ? ' while having a minimum of ' + loop['min_affection'] + ' affection' : '')}`;
				out += `${(loop['min_beauty'] ? ' while having a minimum of ' + loop['min_beauty'] + ' beauty' : '')}`;
				out += `${(loop['min_happiness'] ? ' while having a minimum of ' + loop['min_happiness'] + ' happiness' : '')}`;
				out += `${(loop['needs_overworld_rain'] ? ' while it\'s raining' : '')}`;
				out += `${(loop['party_species'] ? ' while having a ' + loop['party_species'] + ' in the party' : '')}`;
				out += `${(loop['party_type'] ? loop['party_type'] : '')}`;
				out += `${(loop['relative_physical_stats'] ? loop['relative_physical_stats'] : '')}`;
				out += `${(loop['trade_species'] ? ' while trading a ' + loop['party_species'] + ' in the party' : '')}`;
				out += `${(loop['turn_upside_down'] ? ' while it\'s upside down' : '')}`;
			}

			output[evolution] = out;
		});
	});

	let finalOutput = '';
	Object.entries(output).forEach(([id]) => {
		finalOutput += output[id] + '. ';
	});

	return finalOutput.trim();
}