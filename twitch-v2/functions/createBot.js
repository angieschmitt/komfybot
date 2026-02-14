const tmi = require('tmi.js');

module.exports = {
	async function(globals, userID) {
		const parent = this;

		const channels = await parent.retrieveBotUsers(globals);
		const channel = channels[userID];
		const botDataJson = JSON.parse(channel['botData'], 'utf-8');

		const clientData = {
			channels: [ channel['username'] ],
			options: {
				reconnect: true,
				maxReconnectAttempts: 5,
			},
			identity: {
				username: botDataJson['botUsername'],
				password: botDataJson['botToken'],
			},
		};

		// Now create the bot...
		globals['bots'][ channel['userID'] ] = new tmi.client(clientData);

		// Make ^ client, assign some stuff...
		let client = globals['bots'][ channel['userID'] ];
		client['userID'] = channel['userID'];
		client['twitchUUID'] = userID;
		client['channel'] = '#' + channel['username'];
		client['endpoint'] = globals['endpoint'];
		client['socketInfo'] = globals['websocket'];

		// Set the bot info...
		client['clientID'] = botDataJson['clientID'];
		client['appToken'] = botDataJson['appToken'];
		client['botToken'] = botDataJson['botToken'];

		client['intervals'] = {
			// to keep a reference to all the intervals
			intervals : new Set(),

			// create another interval
			make(...args) {
				const newInterval = setInterval(...args);
				this.intervals.add(newInterval);
				return newInterval;
			},

			// clear a single interval
			clear(id) {
				this.intervals.delete(id);
				return clearInterval(id);
			},

			// clear all intervals
			clearAll() {
				for (const id of this.intervals) {
					this.clear(id);
				}
			},
		};

		// Then connect to twitch...
		client.connect()
			.then(async () => {
				await parent.eventsLoad(client);

				// One call to load them all...
				await parent.dashboardLoad(client);

				await parent.liveLoad(client, channel['userID']);
				await parent.refreshConnection(client);

				// Load in data...
				await parent.dataLoad('chatters', client);
				await parent.dataLoad('chaos-mode', client);

				// Create websocket connections...
				await parent.socketLoad(client);
				await parent.eventsubLoad(client);
			})
			.catch(err => console.log(err));

		return globals;
	},
};