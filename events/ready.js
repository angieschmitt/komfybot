require('../globals');

const axios = require('axios');
const { Events, ActivityType, EmbedBuilder, roleMention } = require('discord.js');

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
		let started_at = '';
		checkIfLive(5000, started_at, function(x) {

			// Come back to this since it doesn't currently reset
			if (x.is_live) {
				// client.user.setActivity('activity', { type: ActivityType.Watching });
				// client.user.setPresence({
				// 	activities:
				// 		[
				// 			{
				// 				name: x.user_name,
				// 				type: ActivityType.Watching,
				// 			},
				// 		],
				// 	status: 'idle',
				// });
			}

			if (x.is_live && started_at !== x.started_at) {

				const { channels, notifications } = require(configFile); // eslint-disable-line

				const twitch = roleMention(notifications.twitch);
				const embed = new EmbedBuilder()
					.setColor(0xC44578)
					.setAuthor({ name: x.user_name, iconURL: x.user_thumbnail })
					.setTitle((x.title != '' ? x.title : 'Title goes here'))
					.setURL('https://www.twitch.tv/' + x.user_login)
					.setThumbnail(x.user_thumbnail)
					.setDescription(`Currently playing ${x.game_name}!`)
					.addFields(
						{ name: 'Viewers', value: `${x.viewer_count}` },
					)
					.setImage(x.thumbnail_url);

				client.channels.fetch(channels.is_live)
					.then(channel => {
						channel.send({ content: `Hey ${twitch}, ${x.user_name} has gone live at https://www.twitch.tv/${x.user_login}.`, embeds: [embed] });
					});

				started_at = x.started_at;
			}

		});

		setInterval(function() {
			axios.get('https://www.kittenangie.com/bots/api/twitch_channel_points.php');
		}, 30000);

	},
};

function checkIfLive(timing, started_at, callback) {
	setInterval(function() {

		axios.get('https://www.kittenangie.com/bots/api/twitch_live.php')
			.then(function(response) {
				callback(response.data);
			})
			.catch(function(error) {
				console.log(error);
			})
			.finally(function() {
				// always executed
			});

	}, timing);
}
