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
			intervals : new Array,

			// create another interval
			make(...args) {
				const id = args.shift();
				const newInterval = setInterval(...args);
				this.intervals[id] = newInterval;
				return newInterval;
			},

			// clear a single interval
			clear(id) {
				delete this.intervals.id;
				return clearInterval(this.intervals[id]);
			},

			// clear all timeouts
			clearAll() {
				Object.entries(this.intervals).forEach(([idx]) => {
					this.clear(idx);
				});
			},
		};
		client['timeouts'] = {
			// to keep a reference to all the timeouts
			timeouts : new Array,

			// create another timeouts
			make(...args) {
				const id = args.shift();
				const newTimeout = setTimeout(...args);
				this.timeouts[id] = newTimeout;
				return newTimeout;
			},

			// clear a single timeouts
			clear(id) {
				delete this.timeouts.id;
				return clearTimeout(this.timeouts[id]);
			},

			// clear all timeouts
			clearAll() {
				Object.entries(this.timeouts).forEach(([idx]) => {
					this.clear(idx);
				});
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