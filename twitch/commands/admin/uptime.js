const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'uptime',
	help: 'Check how long the streamer\'s been online. ',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				axios.get(data.settings.finalUrl + 'uptime/retrieve/' + channel.replace('#', ''))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = `@${channel.replace('#', '')} has been live for: ` + resData.response;
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
				axios.get(data.settings.finalUrl + 'uptime/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							const dt = new Date();
							const padL = (nr, len = 2, chr = '0') => `${nr}`.padStart(len, chr);
							content = `Uptime Set to ${padL(dt.getMonth() + 1)}/${padL(dt.getDate())}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`;
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
						client.say(channel, content);
					});
			},
		},
	},
};