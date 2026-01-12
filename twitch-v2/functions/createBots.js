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
			globals['bots'][results['userID']].connect()
				.then(() => {
					parent.loadEvents(globals['bots'][results['userID']]);
					parent.loadCommands(globals['bots'][results['userID']], globals, results['userID']);
					parent.refreshConnection(clientData, globals, globals['bots'][results['userID']]);
				})
				.catch(err => console.log(err));

			// Set this for use where needed...
			globals['bots'][results['userID']]['userID'] = results['userID'];
			globals['bots'][results['userID']]['username'] = results['username'];

		});

		return globals;
	},
};