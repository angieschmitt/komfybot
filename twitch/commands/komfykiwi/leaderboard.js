const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	list: false,
	name: 'leaderboard',
	channel: 'komfykiwi',
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
				axios.get(data.settings.finalUrl + 'coins/retrieve/hold/')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if (Object.keys(resData.response).length) {
								content += 'Top 5 Coin Holders: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(resData.response).forEach(([key, details]) => {
									content += `${details['username']} - ${details['total']} || `;
								});
								content = content.substring(0, content.length - 4);
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie 3.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie 2.';
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
				axios.get(data.settings.finalUrl + 'coins/retrieve/spent/')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if (Object.keys(resData.response).length) {
								content += 'Top 5 Coin Spenders: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(resData.response).forEach(([key, details]) => {
									content += `${details['username']} - ${details['total']} || `;
								});
								content = content.substring(0, content.length - 4);
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie 3.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie 2.';
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