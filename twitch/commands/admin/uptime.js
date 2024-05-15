const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: 'uptime',
	help: 'Check how long the streamer\'s been online. ',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.newUrl + 'uptime/retrieve/' + channel.replace('#', ''))
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = `@${channel.replace('#', '')} has been live for: ` + output.response;
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
		reset: {
			help: 'MOD command to reset the uptime counter. !uptime reset',
			perms: {
				levels: ['streamer', 'mod'],
				error: 'This is a mod+ only command',
			},
			execute(args, tags, message, channel, client) {

				const twitchData = { 'ident_type':'twitch_username', 'ident':channel.replace('#', '') };

				let content = '';
				axios.get(data.settings.newUrl + 'uptime/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							const dt = new Date();
							const padL = (nr, len = 2, chr = '0') => `${nr}`.padStart(len, chr);
							content = `Uptime Set to ${padL(dt.getMonth() + 1)}/${padL(dt.getDate())}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`;
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