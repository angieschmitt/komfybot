const axios = require('axios');
const ws = require('ws');

module.exports = {
	async function(client) {

		await module.exports.connect(client);

		return client;

	},
	async connect(client, refreshUrl = false) {

		const connectUrl = (refreshUrl == false ? 'wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=30' : refreshUrl);

		let activeEventsub = client.eventsub;

		// If it's already an object, create it...
		if ((typeof activeEventsub) != 'object') {
			activeEventsub = new ws(connectUrl);
		}

		activeEventsub.onopen = () => {
			// console.log(client.channel + ' : Opened successful!');
		};

		activeEventsub.on('message', async (data) => {
			const message = JSON.parse(data);

			if (message.metadata.message_type === 'session_welcome') {
				const sessionId = message.payload.session.id;

				activeEventsub.keepAlive = message.metadata.message_timestamp;
				activeEventsub.keepAliveMax = message.payload.session.keepalive_timeout_seconds;

				if (client.appToken) {
					await module.exports.subscribeToOnline(sessionId, client);
					await module.exports.subscribeToOffline(sessionId, client);
					await module.exports.subscribeToChannelPoints(sessionId, client);
				}

				activeEventsub.keepAliveTimer = setInterval(() => {
					const now = new Date();
					const keepAlive = new Date(activeEventsub.keepAlive);
					const diffInSeconds = Math.floor((now.getTime() - keepAlive.getTime()) / 1000);
					if (diffInSeconds >= activeEventsub.keepAliveMax) {
						console.log(client.channel + ' : keepAlive reset!');
						activeEventsub.close();
					}
				}, (activeEventsub.keepAliveMax * 1000));
			}
			else if (message.metadata.message_type === 'notification') {

				activeEventsub.keepAlive = message.metadata.message_timestamp;

				// If a channel point redeem...
				if (message.payload.subscription.type == 'channel.channel_points_custom_reward_redemption.add') {
					const redemptionID = message.payload.event.reward.id;
					if (redemptionID in client.redeems) {
						client.redeems[redemptionID].redeemHandler(message.payload.event, client);
					}
				}
				else if (message.payload.subscription.type == 'stream.online') {
					// console.log(`Channel ${message.payload.event.broadcaster_user_name} is now ONLINE.`);

					axios.get(client.endpoint + 'live/update/' + client.userID);
					client.isLive = true;

					// If online comes in, clear offline timer...
					clearTimeout(client.offlineTimer);
				}
				else if (message.payload.subscription.type == 'stream.offline') {
					// console.log(`Channel ${message.payload.event.broadcaster_user_name} is now OFFLINE.`);

					// Once we get the offline ping, wait 10 mins to mark offline...
					client.offlineTimer = setTimeout(() => {
						axios.get(client.endpoint + 'live/update/' + client.userID);
						client.isLive = false;
					}, 600000);

				}
			}
			else if (message.metadata.message_type === 'session_reconnect') {
				console.log(`Maintenance incoming! Reconnecting to: ${reconnectUrl}`);
				const reconnectUrl = message.payload.session.reconnect_url;
				module.exports.connect(client, reconnectUrl);
			}
			else if (message.metadata.message_type === 'session_keepalive') {
				activeEventsub.keepAlive = message.metadata.message_timestamp;
			}

		});

		activeEventsub.onclose = () => {
			console.log(client.channel + ' : Closed successful!');
			setTimeout(function() {
				console.log(client.channel + ' : Sending refresh!');
				module.exports.connect(client);
			}, 500, client);
		};

		client.eventsub = activeEventsub;

		return client;
	},
	async subscribeToOnline(sessionId, client) {
		try {
			await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
				type: 'stream.online',
				version: '1',
				condition: { broadcaster_user_id: client.twitchUUID },
				transport: {
					method: 'websocket',
					session_id: sessionId,
				},
			}, {
				headers: {
					'Client-ID': client.clientID,
					'Authorization': `Bearer ${client.appToken}`,
					'Content-Type': 'application/json',
				},
			});
			console.log(client.channel + ' : Online successful!');
		}
		catch (err) {
			console.error(client.channel + ' : Online failed : ' + err.response.data.message);
		}
	},
	async subscribeToOffline(sessionId, client) {
		try {
			await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
				type: 'stream.offline',
				version: '1',
				condition: { broadcaster_user_id: client.twitchUUID },
				transport: {
					method: 'websocket',
					session_id: sessionId,
				},
			}, {
				headers: {
					'Client-ID': client.clientID,
					'Authorization': `Bearer ${client.appToken}`,
					'Content-Type': 'application/json',
				},
			});
			console.log(client.channel + ' : Offline successful!');
		}
		catch (err) {
			console.error(client.channel + ' : Offline failed : ' + err.response.data.message);
		}
	},
	async subscribeToChannelPoints(sessionId, client) {
		try {
			await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
				type: 'channel.channel_points_custom_reward_redemption.add',
				version: '1',
				condition: { broadcaster_user_id: client.twitchUUID },
				transport: {
					method: 'websocket',
					session_id: sessionId,
				},
			}, {
				headers: {
					'Client-ID': client.clientID,
					'Authorization': `Bearer ${client.appToken}`,
					'Content-Type': 'application/json',
				},
			});
			console.log(client.channel + ' : Channel Points successful!');
		}
		catch (err) {
			console.error(client.channel + ' : Channel Points failed : ' + err.response.data.message);
		}
	},
};