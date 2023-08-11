require('../globals');

// const axios = require('axios');
const { Events } = require('discord.js');
// const { Events, ActivityType, EmbedBuilder, escapeMarkdown, roleMention } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// client.user.setActivity('activity', { type: ActivityType.Listening });
		// client.user.setPresence({
		// 	activities:
		// 		[
		// 			{
		// 				name: 'lo-fi beats.',
		// 				type: ActivityType.Listening,
		// 			},
		// 		],
		// 	status: 'idle',
		// });

		// 5 minutes : 300000
		// 5 seconds : 5000
		// setInterval(function() {
		// 	axios.get('https://www.kittenangie.com/bots/api/twitch_live.php')
		// 		.then(function(response) {
		// 			if (response.data !== '') {

		// 				const x = response.data;
		// 				const { channels, notifications } = require(configFile); // eslint-disable-line

		// 				const twitch = roleMention(notifications.twitch);
		// 				const recommends = roleMention(notifications.recommends);
		// 				const embed = new EmbedBuilder()
		// 					.setColor(0xC44578)
		// 					.setAuthor({ name: x.user_name, iconURL: x.user_thumbnail })
		// 					.setTitle((x.title != '' ? x.title : 'Title goes here'))
		// 					.setURL('https://www.twitch.tv/' + x.user_login)
		// 					.setThumbnail(x.user_thumbnail)
		// 					.setDescription(`Currently playing: ${x.game_name}!`)
		// 					.setImage(x.thumbnail_url);

		// 				if (x.user_name.toLowerCase() == 'komfykiwi') {
		// 					client.channels.fetch(channels.is_live)
		// 						.then(channel => {
		// 							channel.send({
		// 								content: `Hey ${twitch}, ${ escapeMarkdown(x.user_name) } has gone live at https://www.twitch.tv/${x.user_login}.`,
		// 								embeds: [embed],
		// 							}).then(() => {
		// 								axios.get('https://www.kittenangie.com/bots/api/twitch_live.php?pinged=' + x.user_id);
		// 							});
		// 						});
		// 				}
		// 				else {
		// 					client.channels.fetch(channels.recommends)
		// 						.then(channel => {
		// 							channel.send({
		// 								content: `Hey ${recommends}, ${ escapeMarkdown(x.user_name) } has gone live at https://www.twitch.tv/${x.user_login}.`,
		// 								embeds: [embed],
		// 							}).then(() => {
		// 								axios.get('https://www.kittenangie.com/bots/api/twitch_live.php?pinged=' + x.user_id);
		// 							});
		// 						});
		// 				}
		// 			}
		// 		})
		// 		.catch(err => console.log(err));
		// 	axios.get(global.baseUrl + 'insert/channel_points/')
		// 		.then(() => {
		// 			axios.get(global.baseUrl + 'interactive/lights/');
		// 		})
		// 		.catch(err => console.log(err));
		// }, 10000);
	},
};