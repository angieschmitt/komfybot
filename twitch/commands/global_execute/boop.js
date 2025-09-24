const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

// axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'boop',
	help: 'Boop someone!',
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

				axios.get(data.settings.finalUrl + 'boop/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content += `BegWan BegWan ${tags.username} booped @${user} on the snoot || `;
							content += `They've been booped ${resData.response} times!`;
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								data.errorMsg.handle(channel, client, 'boop', 'Authorization issue');
							}
							else {
								data.errorMsg.handle(channel, client, 'boop', 'Failed response');
							}
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'boop', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, content);
						}
					});
			},
		},
	},
};