const tmi = require('tmi.js');

module.exports = {
	async function(globals, userID) {
		const parent = this;

		const channels = await parent.retrieveBotUsers(globals);
		const channel = channels[userID];
		const botDataJson = JSON.parse(channel['botData'], 'utf-8');
		const settingsJson = JSON.parse(channel['settings'], 'utf-8');
		const addonsJson = JSON.parse(channel['addons'], 'utf-8');

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
		client['channel'] = '#' + channel['username'];
		client['endpoint'] = globals['endpoint'];
		client['socketInfo'] = globals['websocket'];

		// Then connect to twitch...
		client.connect()
			.then(() => {
				parent.eventsLoad(client);
				parent.addonsLoad(client, globals, channel['userID'], addonsJson);
				parent.settingsLoad(client, globals, channel['userID'], settingsJson);
				parent.commandsLoad(client, globals, channel['userID']);
				parent.redeemsLoad(client, globals, channel['userID']);
				parent.timersLoad(client, globals, channel['userID']);
				parent.reactwordsLoad(client, globals, channel['userID']);
				parent.liveLoad(client, globals, channel['userID']);
				parent.refreshConnection(client, globals, clientData);

				// Load in data...
				parent.dataLoad('chatters', client, globals);

				// Create websocket connection...
				parent.socketLoad(client);
			})
			.catch(err => console.log(err));

		return globals;
	},
};