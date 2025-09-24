const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	list: false,
	name: 'leaderboard',
	// channel: 'komfykiwi',
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

				const jsonData = { 'action': 'hold' };

				let content = '';
				axios.get(data.settings.finalUrl + 'coins/retrieve/json/' + encodeURIComponent(JSON.stringify(jsonData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if (Object.keys(resData.response).length) {
								content += 'Top 5 Coin Holders: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(resData.response).forEach(([key, details]) => {
									content += `${details['username']} :: ${details['total']} || `;
								});
								content = content.substring(0, content.length - 4);
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								data.errorMsg.handle(channel, client, 'leaderboard-hoarders', 'Authorization issue');
							}
							else {
								data.errorMsg.handle(channel, client, 'leaderboard-hoarders', 'Failed response');
							}
						}
						else {
							data.errorMsg.handle(channel, client, 'leaderboard-hoarders', 'Not sure how you got here');
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'leaderboard-hoarders', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, `${content}`);
						}
					});
			},
		},
		spenders: {
			execute(args, tags, message, channel, client) {

				const jsonData = { 'action': 'spent' };

				let content = '';
				axios.get(data.settings.finalUrl + 'coins/retrieve/json/' + encodeURIComponent(JSON.stringify(jsonData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							if (Object.keys(resData.response).length) {
								content += 'Top 5 Coin Spenders: ';
								// eslint-disable-next-line no-unused-vars
								Object.entries(resData.response).forEach(([key, details]) => {
									content += `${details['username']} :: ${parseInt(details['total']) * -1} || `;
								});
								content = content.substring(0, content.length - 4);
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								data.errorMsg.handle(channel, client, 'leaderboard-spenders', 'Authorization issue');
							}
							else {
								data.errorMsg.handle(channel, client, 'leaderboard-spenders', 'Failed response');
							}
						}
						else {
							data.errorMsg.handle(channel, client, 'leaderboard-spenders', 'Not sure how you got here');
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'leaderboard-spenders', 'Issue while handling command');
					})
					.finally(function() {
						client.say(channel, `${content}`);
					});
			},
		},
	},
};