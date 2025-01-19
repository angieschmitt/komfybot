const axios = require('axios');
const dataFile = require('../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	eventHandler(channel, username, viewers, tags) {
		// Get client
		const client = this;

		let content = '';
		axios.get(data.settings.finalUrl + 'shoutout/insert/' + username)
			.then(function(response) {
				const resData = response.data;
				if (resData.status === 'success') {
					axios.get(data.settings.finalUrl + 'shoutout/retrieve/' + username)
						.then(function(response2) {
							const resData2 = response2.data;
							if (resData2.status === 'success') {

								// Custom raid message per channel?
								if (channel === '#komfykiwi') {
									content = `Holy cocoa and blankies, ${username} is raiding with ${viewers} ${(viewers > 1 ? 'viewers' : 'viewer')}!`;
								}
								else {
									content = `${username} is raiding with ${viewers} ${(viewers > 1 ? 'viewers' : 'viewer')}!`;
								}

								// Slap on the last playing message
								if (resData2.response.last) {
									content += ` They just wrapped up playing ${resData2.response.last}, and have entrusted their community to us!`;
								}

								// Now say it, and do extras if there are some...
								client.say(channel, content)
									.then(() => {

										if (channel === '#komfykiwi') {
											// Handle raid hat?
											if (viewers > 1) {
												let content = '';
												const amount = 160;
												const reason = 'AUTO RAID HAT!';
												axios.get(data.settings.baseUrl + 'insert/coins/?username=' + username.toLowerCase() + '&twitch_id=' + tags['user-id'] + '&amount=' + amount + '&reason=' + reason)
													.then(function(response) {
														const output = response.data;
														if (output.status === 'success') {
															content = `As a thank you for raiding us @${username}, we've added ${amount} KomfyCoins to your wallet! Use !hats or !snacks to buy stuff for Hattyboi!`;
														}
														else if (output.status === 'failure') {
															if (output.err_msg === 'no_twitch_id') {
																content = 'That username doesn\'t seem to be in our system.';
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
														client.say(channel, content);
														// axios.post(data.settings.baseUrl + 'coins_fix');
													});
											}
										}

									})
									.catch(err => console.log(err));
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
						.catch(function(error) {
							console.log(error);
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
				client.say(channel, content);
			});

		console.log('caught raid');
		console.log(channel);
		console.log(username);
		console.log(viewers);
		console.log(tags);
	},
};