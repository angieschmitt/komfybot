const axios = require('axios');
const ws = require('ws');

module.exports = {
	async function(client) {

		client.eventsub = false;
		client.eventsub = module.exports.connect(client);

	},
	connect(client) {

		let activeEventSocket = client.eventsub;

		const websocket = new ws('wss://eventsub.wss.twitch.tv/ws');
		websocket.on('message', async (data) => {
			const message = JSON.parse(data);

			if (message.metadata.message_type === 'session_welcome') {
				const sessionId = message.payload.session.id;
				console.log(`Connected! Session ID: ${sessionId}`);

				if (activeEventSocket !== false) {
					if (websocket && websocket !== activeEventSocket) {
						console.log('Closing old socket after successful migration.');
						if (activeEventSocket) {
							activeEventSocket.close();
						}
					}
				}
				activeEventSocket = websocket;

				if (client.appToken) {
					await module.exports.subscribeToOnline(sessionId, client);
					await module.exports.subscribeToOffline(sessionId, client);
					await module.exports.subscribeToChannelPoints(sessionId, client);
				}
			}
			else if (message.metadata.message_type === 'notification') {

				const event = message.payload.event;

				// If a channel point redeem...
				if (message.payload.subscription.type == 'channel.channel_points_custom_reward_redemption.add') {
					const redemptionID = message.payload.event.reward.id;
					if (redemptionID in client.redeems) {
						client.redeems[redemptionID].redeemHandler(message.payload.event, client);
					}
				}
				else if (message.payload.subscription.type == 'stream.online') {
					console.log(`Channel ${event.broadcaster_user_name} is now ONLINE.`);

					axios.get(client.endpoint + 'live/update' + client.userID);
					client.isLive = true;

					// If online comes in, clear offline timer...
					clearTimeout(client.offlineTimer);
				}
				else if (message.payload.subscription.type == 'stream.offline') {
					console.log(`Channel ${event.broadcaster_user_name} is now OFFLINE.`);

					// Once we get the offline ping, wait 10 mins to mark offline...
					client.offlineTimer = setTimeout(() => {
						axios.get(client.endpoint + 'live/update' + client.userID);
						client.isLive = false;
					}, 600000);

				}
			}
			else if (message.metadata.message_type === 'session_reconnect') {
				// console.log(`Maintenance incoming! Reconnecting to: ${reconnectUrl}`);
				const reconnectUrl = message.payload.session.reconnect_url;
				module.exports.connect(reconnectUrl);
			}

		});

		return activeEventSocket;
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
