const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'shoutout',
	help: 'MOD command to shout out a user in chat!',
	aliases: {
		'so': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'This command is for mods only!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				if (!args[1]) {
					client.say(channel, 'Make sure to include the user to shoutout!');
				}
				else {
					let username = '';
					if (args[1]) {
						if (args[1].indexOf('@') === 0) {
							username = args[1].substring(1);
						}
						else {
							username = args[1];
						}
					}
					else {
						username = tags.username;
					}

					axios.get(data.settings.newUrl + 'shoutout/insert/' + username)
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								axios.get(data.settings.newUrl + 'shoutout/retrieve/' + username)
									.then(function(response) {
										const output = response.data;
										if (output.status === 'success') {

											// Start the content
											content = `Make sure you check out @${output.response.name}, over at https://www.twitch.tv/${output.response.name} ! `;

											// Slap in the last game
											if (output.response.last) {
												content += `They were last seen playing ${output.response.last} `;
											}

											// Next we work on recents
											let rand = 0;
											const items = [];
											const recent = JSON.parse(output.response.game_log);

											// If last is set, remove from recent
											if (output.response.last) {
												const index = recent.indexOf(output.response.last);
												if (index !== false) {
													recent.splice(index, 1);
												}
											}

											// Select 3 randoms
											if (recent.length) {
												rand = randomProp(recent);
												items.push(recent[rand]);
												recent.splice(rand, 1);
											}
											if (recent.length) {
												rand = randomProp(recent);
												items.push(recent[rand]);
												recent.splice(rand, 1);
											}
											if (recent.length) {
												rand = randomProp(recent);
												items.push(recent[rand]);
												recent.splice(rand, 1);
											}

											if (items.length > 1) {
												let games = '';
												Object.entries(items).forEach(([key, value]) => {
													if (items.length > (parseInt(key) + 1)) {
														games += value + ', ';
													}
													else {
														games += ' and ' + value;
													}
												});
												content += 'and other games like: ' + games + '.';
											}
											else {
												content += `and ${items[0]}.`;
											}
										}
									})
									.catch(function() {
										content = `Go check out @${username} at https://www.twitch.tv/${username}!`;
									})
									.finally(function() {
										client.say(channel, content);
									});
							}
						})
						.catch(function() {
							content = 'Something went wrong, tell @kittenAngie.';
						})
						.finally(function() {
							client.say(channel, content);
						});
				}
			},
		},
	},
};

const randomProp = obj => Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0];