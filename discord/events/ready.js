require('../data/globals');

const axios = require('axios');
const { Events, ActivityType, EmbedBuilder, escapeMarkdown, roleMention } = require('discord.js');
const { channels, notifications, urls } = require(configFile); // eslint-disable-line

const twitch = roleMention(notifications.twitch);
const recommends = roleMention(notifications.recommends);

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setActivity('activity', { type: ActivityType.Listening });
		client.user.setPresence({
			activities: [ { name: 'lo-fi beats.', type: ActivityType.Listening } ],
			status: 'idle',
		});

		// 5 minutes : 300000
		// 5 seconds : 5000
		setInterval(function() {
			handleChannelPoints();
		}, 5000);
		setInterval(function() {
			handleLiveCheck(client);
			handleTokenRefresh();
		}, 10000);
	},
};

async function handleLiveCheck(client) {
	let data = {};
	const cacheBuster = new Date().getTime();
	axios.get(urls.baseUrl2 + 'live_check/insert?cache=' + cacheBuster)
		.then(function(response) {
			if (response.data.status !== 'failure') {
				axios.get(urls.baseUrl2 + 'live_check/retrieve?cache=' + cacheBuster)
					.then(function(response) {
						if (response.data.status !== 'failure') {
							data = response.data.stream_data;

							const embed = new EmbedBuilder()
								.setColor(0xC44578)
								.setAuthor({ name: data.user_name, iconURL: data.user_thumbnail })
								.setTitle(escapeMarkdown(data.title != '' ? data.title : 'Title goes here'))
								.setURL('https://www.twitch.tv/' + data.user_login)
								.setThumbnail(data.user_thumbnail)
								.setDescription(`Currently playing: ${data.game_name}!`)
								.setImage(data.thumbnail_url + '?v=' + Math.random());

							const pingChannel = (data.user_name.toLowerCase() == 'komfykiwi' ? channels.is_live : channels.recommends);
							const pingWho = (data.user_name.toLowerCase() == 'komfykiwi' ? twitch : recommends);
							axios.get(urls.baseUrl + 'retrieve/is_live?pinged=' + data.user_id)
								.then(function() {
									client.channels.fetch(pingChannel)
										.then(channel => {
											channel.send({
												content: `Hey ${pingWho}, ${ escapeMarkdown(data.user_name) } has gone live at https://www.twitch.tv/${data.user_login}.`,
												embeds: [embed],
											});
										})
										.catch(err => console.log(err));
								})
								.catch(err => console.log(err))
								.finally(() => {
									data = {};
								});
						}
					})
					.catch(err => console.log(err));
			}
		})
		.catch(err => console.log(err));
	// controller.abort();
}

async function handleChannelPoints() {
	// Check for channel points
	axios.get(urls.baseUrl + 'insert/channel_points/')
		.then(() => {
			axios.get(urls.baseUrl + 'interactive/lights/');
			axios.get(urls.baseUrl + 'interactive/coins/conversion');
			axios.get(urls.finalUrl + 'redeems/vip/manage');
		})
		.catch(err => console.log(err));
}

async function handleTokenRefresh() {
	axios.get(urls.finalUrl + 'tokens/update/')
		.catch(err => console.log(err));
}