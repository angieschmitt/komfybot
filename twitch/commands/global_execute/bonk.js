const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

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

				axios.get(data.settings.newUrl + 'bonk/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content += `BOP BOP @${user} got bonked by ${tags.username} || `;
							content += `They've been bonked ${output.response} times!`;
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
			},
		},
	},
};