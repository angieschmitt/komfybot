const tmi = require('tmi.js');
const axios = require('axios');
// const fs = require('node:fs');
// const path = require('node:path');

const branch = 'live';

// Load in data
const dataFile = require('./data/index');
const data = dataFile.content();

// Define auth for axios stuff
axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

// Connect to Twitch:
const client = new tmi.client(data.settings[branch]);
client.connect().catch(console.error);

data.functions.loadBranch(client, data, branch);
data.functions.loadEvents(client);
data.functions.loadCommands(client);
data.functions.loadExternalCommands(client, data);
data.functions.loadSettings(client);
data.functions.loadExternalSettings(client, data);

// Start the command refresh check
data.functions.checkForCommandRefresh(data, client);

// Handle BAT File args
// These resets need to be made channel specific, as does the API
//  -- fun
const extArgs = process.argv.slice(2);
if (Object.keys(extArgs).length !== 0) {
	if (extArgs[0] === 'reset') {
		// Handle Reset
		const handleReset = new Promise((resolve) => {
			const twitchData = { 'ident_type':'twitch_username', 'ident':'komfykiwi' };
			axios.get(data.settings.newUrl + 'uptime/insert/json/' + encodeURIComponent(JSON.stringify(twitchData)))
				.then(() => {
					axios.get(data.settings.newUrl + 'guess/reset/komfykiwi')
						.then(() => {
							axios.get(data.settings.newUrl + 'count/reset/komfykiwi')
								.then(() => {
									axios.get(data.settings.newUrl + 'racers/reset')
										.then(() => {
											resolve();
										});
								});
						});
				});
		});

		handleReset.then(() => {
			data.functions.handleTimers(data, data.timers, client);
			data.debug.write('global', 'RESET');
		});
	}
}
else {
	data.functions.handleTimers(data, data.timers, client);
}
data.debug.write('global', 'LAUNCHED');