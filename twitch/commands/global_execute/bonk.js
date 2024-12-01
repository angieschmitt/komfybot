const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'bonk',
	help: 'Bonk someone!',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';

				let twitchData, user = false;
				if (!args[1]) {
					user = channel.replace('#', '');
					twitchData = { 'ident_type':'twitch_username', 'ident':user };
				}
				else {
					user = args[1].replace('@', '');
					twitchData = { 'ident_type':'twitch_username', 'ident':user };
				}

				axios.get(data.settings.finalUrl + 'bonk/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `BOP BOP @${user} got bonked by ${tags.username} || `;
							content += `They've been bonked ${resData.response} times!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie.';
							}
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
	},
};