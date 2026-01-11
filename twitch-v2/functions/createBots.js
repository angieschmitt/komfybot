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

			globals['bots'][results['username']] = new tmi.client(clientData);
			globals['bots'][results['username']].connect()
				.then(() => {
					parent.loadEvents(globals['bots'][results['username']]);
					parent.loadCommands(globals['bots'][results['username']], globals, results['userID']);
					parent.refreshConnection(clientData, globals, globals['bots'][results['username']]);
				})
				.catch(err => console.log(err));
		});

		return globals;
	},
};