const axios = require('axios');
const { Events, ActivityType, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// 5 minutes : 300000
		// 5 seconds : 5000
		let started_at = '';
		checkIfLive(5000, started_at, function(x) {

			if (x.is_live && started_at !== x.started_at) {

				const embed = new EmbedBuilder()
					.setColor(0xC44578)
					.setTitle('KomfyKiwi is Live on Twitch')
					.setURL('https://www.twitch.tv/komfykiwi')
					.setDescription(`Currently playing ${x.game_name}!`)
					.setThumbnail(x.thumbnail_url)
					.addFields(
						{ name: 'Regular field title', value: 'Some value here' },
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Inline field title', value: 'Some value here', inline: true },
						{ name: 'Inline field title', value: 'Some value here', inline: true },
					)
					.setTimestamp()
					.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

				client.channels.fetch('1045318121839407154')
					.then(channel => {
						channel.send({ embeds: [embed] });
					});

				started_at = x.started_at;

			}

		});

		client.user.setActivity('activity', { type: ActivityType.Listening });
		client.user.setPresence(
			{ activities:
				[
					{
						name: 'lo-fi beats.',
						type: ActivityType.Listening,
					},
				],
			status: 'idle',
			});

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
