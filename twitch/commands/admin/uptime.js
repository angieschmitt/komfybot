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
								data.errorMsg.handle(channel, client, 'uptime', 'Authorization issue');
							}
							else {
								data.errorMsg.handle(channel, client, 'uptime', 'Failed response');
							}
						}
						else {
							data.errorMsg.handle(channel, client, 'uptime', 'Issue with user lookup');
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'uptime', 'Issue while handling command');
					})
					.finally(function() {
						if (content !== '') {
							client.say(channel, content);
						}
					});
			},
		},
		reset: {
			help: 'MOD command to reset the uptime counter. !uptime reset',
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
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
								data.errorMsg.handle(channel, client, 'uptime-reset', 'Authorization issue');
							}
							else {
								data.errorMsg.handle(channel, client, 'uptime-reset', 'Failed response');
							}
						}
						else {
							data.errorMsg.handle(channel, client, 'uptime-reset', 'Issue with user lookup');
						}
					})
					.catch(function() {
						data.errorMsg.handle(channel, client, 'uptime-reset', 'Issue while handling command');
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