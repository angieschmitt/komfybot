const axios = require('axios');
const baseUrl = 'https://www.kittenangie.com/bots/api_new/';

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

					axios.get(baseUrl + 'retrieve/shoutout?twitch_username=' + username)
						.then(function(response) {
							const output = response.data;
							if (output.status === 'success') {
								const recent = output.content.recent;
								let rand = 0;
								const items = [];

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

								content = `Make sure you check out @${username}, over at https://www.twitch.tv/${username} ! `;
								content += `They were last seen playing ${output.content.latest} `;

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
							else {
								content = `Go check out @${username} at https://www.twitch.tv/${username}!`;
							}
						})
						.catch(function() {
							content = `Go check out @${username} at https://www.twitch.tv/${username}!`;
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