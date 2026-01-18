const tmi = require('tmi.js');

module.exports = {
	async function(globals) {
		const parent = this;

		const channels = await parent.retrieveBotUsers(globals);
		Object.entries(channels).forEach(async ([uuid, results]) => { // eslint-disable-line no-unused-vars
			const botDataJson = JSON.parse(results['botData'], 'utf-8');

			const clientData = {
				channels: [ results['username'] ],
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
			globals['bots'][results['userID']] = new tmi.client(clientData);

			// Make ^ client, assign some stuff...
			const client = globals['bots'][results['userID']];
			client['userID'] = results['userID'];
			client['channel'] = '#' + results['username'];

			// Then connect to twitch...
			client.connect()
				.then(() => {
					parent.eventsLoad(client);
					parent.commandsLoad(client, globals, results['userID']);
					parent.timersLoad(client, globals, results['userID']);
					parent.liveLoad(client, globals, results['userID']);
					parent.refreshConnection(client, globals, clientData);
				})
				.catch(err => console.log(err));
		});

		return globals;
	},
};