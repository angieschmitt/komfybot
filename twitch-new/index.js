const tmi = require('tmi.js');
const axios = require('axios');
// const fs = require('node:fs');
// const path = require('node:path');

const branch = 'live';

// Load in data
const dataFile = require('./data/index');
const data = dataFile.content();

// Connect to Twitch:
const client = new tmi.client(data.settings[branch]);
client.connect().catch(console.error);

data.functions.loadBranch(client, data, branch);
data.functions.loadEvents(client);
data.functions.loadCommands(client);

// Handle BAT File args
// These resets need to be made channel specific, as does the API
//  -- fun
const extArgs = process.argv.slice(2);
if (Object.keys(extArgs).length !== 0) {
	if (extArgs[0] === 'reset') {
		// Handle Reset
		const handleReset = new Promise((resolve) => {
			axios.get(data.settings.baseUrl + 'insert/uptime')
				.then(() => {
					axios.get(data.settings.baseUrl + 'insert/guesses?reset')
						.then(() => {
							axios.get(data.settings.baseUrl + 'insert/count?reset')
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