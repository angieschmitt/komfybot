const axios = require('axios');
const ws = require('ws');
const { EmbedBuilder, escapeMarkdown } = require('discord.js');

module.exports = {
	async function(client) {
		const parent = this;

		const identifier = 'discord:' + client.userID;
		const websocket = new ws('wss://' + client.socketInfo.ip + ':' + client.socketInfo.port + '/' + identifier, { rejectUnauthorized: false });

		websocket.onopen = () => {
			websocket.send(JSON.stringify({ 'action': 'refresh', 'data': { 'target': 'all' }, 'source': identifier }));
			client.timeouts.clear('websocketRetry');
		};

		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			// Setup targets for checking against...
			const targets = [];
			if (typeof data.target === 'object') {
				data.target.forEach(element => {
					let iter = 0;
					Object.entries(data.userList).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
						if (iter == element) {
							targets.push(idx);
						}
						iter++;
					});
				});
			}

			// Now only run if it's supposed to...
			if (data.action === 'ping' && targets.includes(identifier)) {
				if ('live' in data.data) {
					axios.get(client.endpoint + 'discord/shoutout/' + client.userID + '/' + data.data.live)
						.then(function(response) {
							if (response.data.status == 'success') {
								// Set the streamData
								const resData = response.data.response;
								const streamData = resData.streamData;

								if (Object.keys(streamData).length) {

									// Define a thumbnail...
									let gameThumbnail = streamData['thumbnail_url'];
									gameThumbnail = gameThumbnail.replace('{height}', '400');
									gameThumbnail = gameThumbnail.replace('{width}', '640');

									const embed = new EmbedBuilder()
										.setColor(0xC44578)
										.setAuthor({ name: streamData.user_name })
										.setTitle(escapeMarkdown(streamData.title != '' ? streamData.title : 'Title goes here'))
										.setURL('https://www.twitch.tv/' + streamData.user_login)
										// .setThumbnail(streamData.user_thumbnail)
										.setDescription(`Currently playing: ${streamData.game_name}!`)
										.setImage(gameThumbnail + '?v=' + Math.random());

									let outputChannel = client.settings.channels['bot_testing'];
									let outputText = `Hey ${client.settings.notifications.recommends}, ${ escapeMarkdown(streamData.user_name) } has gone live at https://www.twitch.tv/${streamData.user_login}.`;
									if (client.userID == data.data.live) {
										outputChannel = client.settings.channels['bot_testing'];
										outputText = `Hey ${client.settings.notifications.twitch}, ${ escapeMarkdown(streamData.user_name) } has gone live at https://www.twitch.tv/${streamData.user_login}.`;
									}
									client.channels.cache.get(outputChannel).send({
										content: outputText,
										embeds: [embed],
									});
								}
							}
						})
						.catch(err => console.log(err));
				}
			}
		};

		websocket.onerror = (error) => {
			console.log(error.message);
		};

		websocket.onclose = () => {
			client.timeouts.clear('websocketRetry');
			client.timeouts.make(
				'websocketRetry',
				(client) => { parent.socketLoad(client); },
				1000,
				client,
			);
		};

		client.intervals.clear('websocketLiveCheck');
		client.intervals.make(
			'websocketLiveCheck',
			() => {
				if (websocket.readyState != 0) {
					websocket.send(JSON.stringify({ 'action': 'live-check', 'data': { 'timestamp': new Date().toISOString() }, 'source': identifier }));
				}
			},
			10000,
		);

		client.websocket = websocket;
	},
};