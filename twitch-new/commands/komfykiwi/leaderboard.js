const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'leaderboard',
	channel: 'kittenangie',
	help: 'Shows who is in the lead for different things! Additional arguments: hoarders, spenders',
	aliases: {
		'top': {
			arg: false,
			list: true,
		},
		'hoarders': {
			arg: 'hoarder',
			list: false,
		},
		'spenders': {
			arg: 'spender',
			list: false,
		},
	},
	actions: {
		default: {
			say: 'Interested in who has or spent the most KomfyCoins? Try !top hoarders or !top spenders to find out!',
		},
		hoarders: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.newUrl + 'coins/retrieve/hold/')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							if (Object.keys(output.response).length) {
								content += 'Top 5 Coin Holders: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(output.response).forEach(([key, details]) => {
									content += `${details['username']} - ${details['total']} || `;
								});
								content = content.substring(0, content.length - 4);
							}
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, `${content}`);
					});
			},
		},
		spenders: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.newUrl + 'coins/retrieve/spent/')
					.then(function(response) {
						const output = response.data;

						console.log(output);

						if (output.status === 'success') {
							if (Object.keys(output.response).length) {
								content += 'Top 5 Coin Spenders: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(output.response).forEach(([key, details]) => {
									content += `${details['username']} - ${details['total']} || `;
								});
								content = content.substring(0, content.length - 4);
							}
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, `${content}`);
					});
			},
		},
	},
};