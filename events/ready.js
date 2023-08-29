require('../globals');

const axios = require('axios');
const { Events, ActivityType, EmbedBuilder, escapeMarkdown, roleMention } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setActivity('activity', { type: ActivityType.Listening });
		client.user.setPresence({
			activities:
				[
					{
						name: 'lo-fi beats.',
						type: ActivityType.Listening,
					},
				],
			status: 'idle',
		});

		// 5 minutes : 300000
		// 5 seconds : 5000
		setInterval(function() {
			// Live check
			const cacheBuster = new Date().getTime();
			axios.get('https://www.kittenangie.com/bots/api/twitch_live.php?&timestamp=' + cacheBuster)
				.then(function(response) {
					if (response.data !== '') {

						const x = response.data;
						const { channels, notifications } = require(configFile); // eslint-disable-line

						const twitch = roleMention(notifications.twitch);
						const recommends = roleMention(notifications.recommends);
						const embed = new EmbedBuilder()
							.setColor(0xC44578)
							.setAuthor({ name: x.user_name, iconURL: x.user_thumbnail })
							.setTitle(escapeMarkdown(x.title != '' ? x.title : 'Title goes here'))
							.setURL('https://www.twitch.tv/' + x.user_login)
							.setThumbnail(x.user_thumbnail)
							.setDescription(`Currently playing: ${x.game_name}!`)
							.setImage(x.thumbnail_url);

						axios.get('https://www.kittenangie.com/bots/api/twitch_live.php?pinged=' + x.user_id)
							.then(function(response2) {
								if (response2.data.status === 'success') {
									const pingChannel = (x.user_name.toLowerCase() == 'komfykiwi' ? channels.is_live : channels.recommends);
									const pingWho = (x.user_name.toLowerCase() == 'komfykiwi' ? twitch : recommends);
									client.channels.fetch(pingChannel)
										.then(channel => {
											channel.send({
												content: `Hey ${pingWho}, ${ escapeMarkdown(x.user_name) } has gone live at https://www.twitch.tv/${x.user_login}.`,
												embeds: [embed],
											});
										});
								}
							});

						// if (x.user_name.toLowerCase() == 'komfykiwi') {
						// 	axios.get('https://www.kittenangie.com/bots/api/twitch_live.php?pinged=' + x.user_id)
						// 		.then(function(response2) {
						// 			if (response2.data.status === 'success') {
						// 				client.channels.fetch(channels.is_live)
						// 					.then(channel => {
						// 						channel.send({
						// 							content: `Hey ${recommends}, ${ escapeMarkdown(x.user_name) } has gone live at https://www.twitch.tv/${x.user_login}.`,
						// 							embeds: [embed],
						// 						});
						// 					});
						// 			}
						// 		});
						// }
						// else {
						// 	axios.get('https://www.kittenangie.com/bots/api/twitch_live.php?pinged=' + x.user_id)
						// 		.then(function(response2) {
						// 			if (response2.data.status === 'success') {
						// 				client.channels.fetch(channels.recommends)
						// 					.then(channel => {
						// 						channel.send({
						// 							content: `Hey ${recommends}, ${ escapeMarkdown(x.user_name) } has gone live at https://www.twitch.tv/${x.user_login}.`,
						// 							embeds: [embed],
						// 						});
						// 					});
						// 			}
						// 		});
						// }
					}
				})
				.catch(err => console.log(err));

			// Check for channel points
			axios.get(global.baseUrl + 'insert/channel_points/')
				.then(() => {
					axios.get(global.baseUrl + 'interactive/lights/');
				})
				.catch(err => console.log(err));

			// Update chatbot token
			axios.get(global.baseUrl + 'generate/token.php?key=komfybot_token');
		}, 10000);
	},
};