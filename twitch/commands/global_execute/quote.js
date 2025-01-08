const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'quote',
	help: 'Pull a quote from our growing database of silliness!',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let id = false;
				let content = '';
				axios.get(data.settings.finalUrl + 'quote/retrieve/' + channel.replace('#', ''))
					.then(function(response) {
						const resData = response.data;
						id = resData.id;
						if (resData.status === 'success') {
							content = `"${resData.response}" - @${resData.username}`;
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
						if (id === '3') {
							client.say(channel, content);
						}
						client.say(channel, content);
					});
			},
		},
		add: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the user or the amount!',
			},
			execute(args, tags, message, channel, client) {

				let quote = message.replace(args[0], '').replace(args[1], '').trim();
				const username = quote.substring(quote.lastIndexOf('@') + 1);
				quote = quote.replace('@' + username, '');

				const channelID = tags['room-id'];
				const whoSubmit = tags['username'];

				let content = '';
				const twitchData = { 'twitch_id': channelID, 'quote': quote, 'user_name': username };
				axios.get(data.settings.finalUrl + 'quote/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${whoSubmit}, thanks for adding that quote!`;
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
			},
		},
	},
};