const axios = require('axios');
const ws = require('ws');

const baseWS = 'wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=30';
// const baseWS = 'ws://127.0.0.1:8080/ws?keepalive_timeout_seconds=10';

const baseSub = 'https://api.twitch.tv/helix/eventsub/subscriptions';
// const baseSub = 'http://localhost:8080/eventsub/subscriptions';

module.exports = {
	async function(client, refreshUrl = false) {
		const parent = this;

		if (!('eventsub' in client)) {
			client.eventsub = {};
			client.eventsub.websocket = false;
		}

		const eventsub = client.eventsub;
		const connectUrl = (refreshUrl == false ? baseWS : refreshUrl);

		// If it's not an object, create it...
		if ((typeof eventsub.websocket) != 'object') {
			eventsub.websocket = new ws(connectUrl);
		}

		eventsub.websocket = new ws(connectUrl);

		// Handle the basics...
		eventsub.websocket.onopen = () => {
			console.log(client.channel + ' : Open successful!');
		};

		eventsub.websocket.onerror = (error) => {
			console.log(client.channel + ' : Error : ' + error.message);
		};

		eventsub.websocket.on('message', async (data) => {
			const message = JSON.parse(data);

			if (message.metadata.message_type === 'session_welcome') {
				// Setup the new data...
				eventsub.sessionID = message.payload.session.id;
				eventsub.keepAliveMax = message.payload.session.keepalive_timeout_seconds;
				eventsub.keepAlive = message.metadata.message_timestamp;

				// If there's a token and we're NOT refreshing...
				if (client.appToken && !refreshUrl) {
					await module.exports.subscribeToOnline(eventsub.sessionID, client);
					await module.exports.subscribeToOffline(eventsub.sessionID, client);
					await module.exports.subscribeToChannelPoints(eventsub.sessionID, client);
				}
			}
			else if (message.metadata.message_type === 'notification') {
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
				parent.eventsubLoad(client, message.payload.session.reconnect_url);
			}

		});

		// const eventsubProxy = new Proxy(eventsub, {
		// 	set: function(target, key, value) {
		// 		let counter = eventsub.keepAliveMax;
		// 		client.intervals.clearAll();
		// 		client.intervals.make(
		// 			(parent) => {
		// 				console.log(counter);
		// 				if (counter <= 2) {
		// 					console.log('keepalive refresh');
		// 					parent.eventsubLoad(client, baseWS);
		// 				}
		// 				counter--;
		// 			}, 1000, parent,
		// 		);
		// 		target[key] = value;
		// 		return true;
		// 	},
		// });

		client.eventsub = eventsub;

		return client;

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