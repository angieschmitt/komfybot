const axios = require('axios');
const ws = require('ws');

const baseWS = 'wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=30';
// const baseWS = 'ws://127.0.0.1:8080/ws?keepalive_timeout_seconds=10';

const baseSub = 'https://api.twitch.tv/helix/eventsub/subscriptions';
// const baseSub = 'http://localhost:8080/eventsub/subscriptions';

module.exports = {
	async function(client) {

		client.eventsub = {};
		client.eventsub = await module.exports.connect(client);

		return client;

	},
	async connect(client, refreshUrl = false, forceClose = false) {

		const eventsub = client.eventsub;
		if (!('websocket' in eventsub)) {
			eventsub.websocket = false;
			eventsub.reconnecting = false;
		}

		const connectUrl = (refreshUrl == false ? baseWS : refreshUrl);

		let activeEventsub = eventsub.websocket;

		// If it's already an object, create it...
		if ((typeof activeEventsub) != 'object') {
			activeEventsub = new ws(connectUrl);
		}
		else if ((typeof activeEventsub) == 'object') {
			if (forceClose) {
				activeEventsub.close();
			}
			if (refreshUrl) {
				activeEventsub = new ws(connectUrl);
			}
		}

		// Handle the basics...
		activeEventsub.onopen = () => {
			console.log(client.channel + ' : Open successful!');

			// Reset the timeouts and intervals...
			clearTimeout(eventsub.reconnecting);
			eventsub.reconnecting = false;
			clearInterval(eventsub.keepAliveTimer);
			eventsub.keepAliveTimer = false;
		};

		activeEventsub.onclose = () => {
			eventsub.reconnecting = setTimeout(function() {
				console.log(client.channel + ' : Connection lost, attempting to reconnect!');
				module.exports.connect(client);
			}, 1000, client);
		};

		activeEventsub.onerror = (error) => {
			console.log(client.channel + ' : Error : ' + error.message);
		};

		// Handle the more complicated stuff...
		activeEventsub.on('message', async (data) => {
			const message = JSON.parse(data);

			if (message.metadata.message_type === 'session_welcome') {
				eventsub.sessionID = message.payload.session.id;
				eventsub.keepAlive = message.metadata.message_timestamp;
				eventsub.keepAliveMax = message.payload.session.keepalive_timeout_seconds;

				if (client.appToken && !refreshUrl) {
					await module.exports.subscribeToOnline(eventsub.sessionID, client);
					await module.exports.subscribeToOffline(eventsub.sessionID, client);
					await module.exports.subscribeToChannelPoints(eventsub.sessionID, client);
				}

				eventsub.keepAliveTimer = setInterval(() => {
					const now = new Date();
					const keepAlive = new Date(eventsub.keepAlive);
					const diffInSeconds = Math.floor((now.getTime() - keepAlive.getTime()) / 1000);
					if (diffInSeconds >= eventsub.keepAliveMax) {
						console.log(client.channel + ' : keepAlive reset!');
						module.exports.connect(client, baseWS, true);
					}
				}, ((eventsub.keepAliveMax - 5) * 1000));
			}
			else if (message.metadata.message_type === 'notification') {

				eventsub.keepAlive = message.metadata.message_timestamp;

				// If a channel point redeem...
				if (message.payload.subscription.type == 'channel.channel_points_custom_reward_redemption.add') {
					const redemptionID = message.payload.event.reward.id;
					if (redemptionID in client.redeems) {
						client.redeems[redemptionID].redeemHandler(message.payload.event, client);
					}
				}
				else if (message.payload.subscription.type == 'stream.online') {
					console.log(`Channel ${message.payload.event.broadcaster_user_name} is now ONLINE.`);

					axios.get(client.endpoint + 'live/update/' + client.userID);
					client.isLive = true;

					// If online comes in, clear offline timer...
					clearTimeout(client.offlineTimer);
				}
				else if (message.payload.subscription.type == 'stream.offline') {
					console.log(`Channel ${message.payload.event.broadcaster_user_name} is now OFFLINE.`);

					// Once we get the offline ping, wait 10 mins to mark offline...
					client.offlineTimer = setTimeout(() => {
						console.log(`Channel ${message.payload.event.broadcaster_user_name} is now OFFICIALLY offline.`);
						axios.get(client.endpoint + 'live/update/' + client.userID);
						client.isLive = false;
					}, 600000);

				}
			}
			else if (message.metadata.message_type === 'session_keepalive') {
				eventsub.keepAlive = message.metadata.message_timestamp;
			}
			else if (message.metadata.message_type === 'session_reconnect') {
				eventsub.keepAlive = message.metadata.message_timestamp;
				console.log(`Maintenance incoming! Reconnecting to: ${message.payload.session.reconnect_url}`);
				module.exports.connect(client, message.payload.session.reconnect_url);
			}

		});

		eventsub.websocket = activeEventsub;

		return eventsub;
	},
	async subscribeToOnline(sessionId, client) {
		try {
			await axios.post(baseSub, {
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
			await axios.post(baseSub, {
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
			await axios.post(baseSub, {
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