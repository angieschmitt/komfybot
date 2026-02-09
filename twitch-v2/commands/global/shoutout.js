const axios = require('axios');

module.exports = {
	list: true,
	name: 'shoutout',
	help: 'Command to shoutout a user in chat',
	aliases: {
		'so': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			perms: {
				levels: ['streamer', 'mod'],
				error: 'this command is for the streamer and mods only.',
			},
			args: {
				required: [ 1 ],
				error: 'don\'t forgot the streamer!',
			},
			execute(args, tags, message, channel, client) {

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

				let content = '';
				axios.get(client.endpoint + 'shoutout/insert/' + username)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							axios.get(client.endpoint + 'shoutout/retrieve/' + username)
								.then(function(response2) {
									const resData2 = response2.data;
									if (resData2.status === 'success') {

										// Start the content
										content = `Make sure you check out @${username} over at https://www.twitch.tv/${username} !`;

										// Slap in the last game
										if (resData2.response) {
											content += ` They were last seen playing ${resData2.response}`;
										}

										// Next we work on recents
										const recent = JSON.parse(resData.response);

										resData2.response = 'Genshin Impact';

										// If there are recents...
										if (Object.keys(recent).length) {

											const items = [];
											// If last is set, remove from recent
											if (resData2.response) {
												const index = recent.indexOf(resData2.response);
												if (index !== false) {
													recent.splice(index, 1);
												}
											}

											// Select 3 randoms
											if (Object.keys(recent).length) {
												const rand1 = randomProperty(recent);
												items.push(recent[rand1]);
												recent.splice(rand1, 1);
											}
											if (Object.keys(recent).length) {
												const rand2 = randomProperty(recent);
												items.push(recent[rand2]);
												recent.splice(rand2, 1);
											}
											if (Object.keys(recent).length) {
												const rand3 = randomProperty(recent);
												items.push(recent[rand3]);
												recent.splice(rand3, 1);
											}

											// If we have items...
											if (items.length) {
												// If we have more than 1, loop and add stuff..
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
													content += ' and other games like: ' + games + '.';
												}
												// Otherwise slap it on the end...
												else {
													content += ` and ${items[0]}.`;
												}
											}
											// Otherwise, add the period...
											else {
												content += '.';
											}
										}
									}
									else if (resData2.status === 'failure') {
										if (resData2.err_msg === 'missing_authorization') {
											content = 'Authorization issue. Tell @kittenAngie.';
										}
										else {
											content = 'Something went wrong, tell @kittenAngie.';
										}
									}
									else {
										content = 'Something went wrong, tell @kittenAngie.';
									}
								})
								.catch(function() {
									content = `Go check out @${username} at https://www.twitch.tv/${username}!`;
								})
								.finally(function() {
									client.say(channel, content).catch(() => {
										setTimeout(() => {
											client.say(channel, content);
										}, 2500);
									});
								});
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content).catch(() => {
							setTimeout(() => {
								client.say(channel, content);
							}, 2500);
						});
					});
			},
		},
	},
};

const randomProperty = obj => Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0];