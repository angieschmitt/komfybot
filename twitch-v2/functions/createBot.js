const tmi = require('tmi.js');

module.exports = {
	async function(globals, userID) {
		const parent = this;

		const channels = await parent.retrieveBotUsers(globals);
		const channel = channels[userID];
		const botDataJson = JSON.parse(channel['botData'], 'utf-8');
		// const settingsJson = JSON.parse(channel['settings'], 'utf-8');
		// const addonsJson = JSON.parse(channel['addons'], 'utf-8');

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
		const client = globals['bots'][ channel['userID'] ];
		client['userID'] = channel['userID'];
		client['twitchUUID'] = userID;
		client['channel'] = '#' + channel['username'];
		client['endpoint'] = globals['endpoint'];
		client['socketInfo'] = globals['websocket'];

		// Set the bot info...
		client['clientID'] = botDataJson['clientID'];
		client['appToken'] = botDataJson['appToken'];
		client['botToken'] = botDataJson['botToken'];

		// Then connect to twitch...
		client.connect()
			.then(() => {
				parent.eventsLoad(client);

				// One call to load them all...
				parent.dashboardLoad(client, globals);

				parent.liveLoad(client, globals, channel['userID']);
				parent.refreshConnection(client, globals, clientData);

				// Load in data...
				parent.dataLoad('chatters', client, globals);

				// Create websocket connections...
				parent.socketLoad(client);
				parent.eventsubLoad(client);
			})
			.catch(err => console.log(err));

		return globals;
	},
};