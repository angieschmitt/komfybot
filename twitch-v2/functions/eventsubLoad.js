const axios = require('axios');
const ws = require('ws');

const baseWS = 'wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=30';
// const baseWS = 'ws://127.0.0.1:8080/ws?keepalive_timeout_seconds=10';

const baseSub = 'https://api.twitch.tv/helix/eventsub/subscriptions';
// const baseSub = 'http://localhost:8080/eventsub/subscriptions';

module.exports = {
	async function(client, refreshUrl = false, forceClose = false) {
		const parent = this;

		// Assign the url we're connecting to...
		const connectUrl = (refreshUrl == false ? baseWS : refreshUrl);

		// If we have to forceClose for some reason...
		if (forceClose) {
			if ('eventsub' in client) {
				client.eventsub.websocket.close();
				client.eventsub = {};
				client.eventsub.websocket = false;
			}
		}

		// If the eventsub object doesn't exist at all...
		if (!('eventsub' in client)) {
			client.eventsub = {};
			client.eventsub.websocket = false;
		}

		// Build the current eventsub...
		const eventsub = client.eventsub;

		// If it's not an object, create it...
		if ((typeof eventsub.websocket) != 'object') {
			eventsub.websocket = new ws(connectUrl);
		}
		// If we have a refreshURL...
		if (refreshUrl) {
			eventsub.websocket = new ws(connectUrl);
		}

		// Setup the keepAliveHandler and proxy...
		eventsub.keepAliveHandler = {
			get(target, prop) {
				return prop;
			},
			set() {
				let counter = (eventsub.keepAliveMax + 2);
				client.intervals.clear('eventsubKeepAlive');
				client.intervals.make(
					'eventsubKeepAlive',
					(parent) => {
						if (counter <= 0) {
							parent.eventsubLoad(client, false, true);
						}
						counter--;
					},
					1000,
					parent,
				);
				return Reflect.get(...arguments);
			},
		};
		eventsub.keepAliveProxy = new Proxy({}, eventsub.keepAliveHandler);

		// Handle the basics...
		eventsub.websocket.onopen = () => {
			// console.log(client.channel + ' : Open successful!');
		};

		eventsub.websocket.onerror = () => {
			client.eventsub.keepAliveProxy.value = new Date(Date.now() - 5000);
		};

		eventsub.websocket.onclose = () => {
			client.eventsub.keepAliveProxy.value = new Date(Date.now() - 5000);
		};

		// Handle the complicated stuff...
		eventsub.websocket.on('message', async (data) => {
			const message = JSON.parse(data);

			if (message.metadata.message_type === 'session_welcome') {
				// Setup the new data...
				eventsub.sessionID = message.payload.session.id;
				eventsub.keepAliveMax = message.payload.session.keepalive_timeout_seconds;

				// If there's a token and we're NOT refreshing...
				if (client.appToken && !refreshUrl) {
					await module.exports.subscribeToOnline(eventsub.sessionID, client);
					await module.exports.subscribeToOffline(eventsub.sessionID, client);
					await module.exports.subscribeToChannelPoints(eventsub.sessionID, client);
				}

				// Update the keepAlive...
				eventsub.keepAliveProxy.value = message.metadata.message_timestamp;
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

					// If this message is about the user...
					if (message.payload.event.broadcaster_user_id == client.twitchUUID) {

						// If online comes in, clear offline timer...
						client.timeouts.clear('offlineTimer');

						// Locally mark the user as live...
						client.isLive = true;

						// Force the DB to update...
						axios.get(client.endpoint + 'live/update/' + client.userID + '/force')
							.then(function(response) {
								const responseData = response.data;
								if (responseData.status === 'success') {
									const userData = responseData.response;
									client.streamData = userData.streamData;

									// If there is streamData, get the offset...
									if (Object.keys(client.streamData).length > 0) {
										const dateLive = new Date(userData.streamData.started_at);
										const dateNow = new Date();
										const minsLive = Math.floor(Math.floor((dateNow - (dateLive)) / 1000) / 60);

										// Set the timerOffset
										client.timerOffset = minsLive;
									}
									// If not, we set it to 0 because they just went live...
									// NOTE: THIS CAN HAVE FUTURE ISSUES
									else {
										// Set the timerOffset
										client.timerOffset = 1;
									}

									parent.timersHandler(client, true);
								}
							})
							.catch((err) => {
								client.debug.write(client.channel, 'USER_ONLINE', err.message);
							});
					}
				}
				else if (message.payload.subscription.type == 'stream.offline') {
					console.log(`Channel ${message.payload.event.broadcaster_user_name} is now OFFLINE.`);

					// If this message is about the user...
					if (message.payload.event.broadcaster_user_id == client.twitchUUID) {
						// Once we get the offline ping, wait 5 mins to mark offline...
						client.timeouts.clear('offlineTimer');
						client.timeouts.make(
							'offlineTimer',
							() => {
								console.log(`Channel ${message.payload.event.broadcaster_user_name} is now OFFICIALLY offline.`);
								axios.get(client.endpoint + 'live/update/' + client.userID);
								client.isLive = false;
							},
							300000,
						);
					}
				}

				// Update the keepAlive...
				eventsub.keepAliveProxy.value = message.metadata.message_timestamp;
			}
			else if (message.metadata.message_type === 'session_keepalive') {
				// Update the keepAlive...
				eventsub.keepAliveProxy.value = message.metadata.message_timestamp;
			}
			else if (message.metadata.message_type === 'session_reconnect') {

				// Reset eventsubKeepAlive before reloading...
				client.intervals.clear('eventsubKeepAlive');

				// Now reset the connection...
				console.log(`Maintenance incoming! Reconnecting to: ${message.payload.session.reconnect_url}`);
				return parent.eventsubLoad(client, message.payload.session.reconnect_url);
			}

		});

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
			// console.log(client.channel + ' : Online successful!');
		}
		catch (err) {
			const parent = this;
			if (err.response.data.message == 'Invalid OAuth token') {
				parent.refreshConnection(client);
			}

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
			// console.log(client.channel + ' : Offline successful!');
		}
		catch (err) {
			const parent = this;
			if (err.response.data.message == 'Invalid OAuth token') {
				parent.refreshConnection(client);
			}

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
			// console.log(client.channel + ' : Channel Points successful!');
		}
		catch (err) {
			const parent = this;
			if (err.response.data.message == 'Invalid OAuth token') {
				parent.refreshConnection(client);
			}

			console.error(client.channel + ' : Channel Points failed : ' + err.response.data.message);
		}
	},
};