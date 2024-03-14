const tmi = require('tmi.js');
// const axios = require('axios');
// const fs = require('node:fs');
// const path = require('node:path');

const branch = 'dev';

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
// const extArgs = process.argv.slice(2);
// if (Object.keys(extArgs).length !== 0) {
// 	if (extArgs[0] === 'reset') {
// 		// Handle Reset
// 		const handleReset = new Promise((resolve) => {
// 			axios.get(data.settings.baseUrl + 'insert/uptime')
// 				.then(() => {
// 					axios.get(data.settings.baseUrl + 'insert/guesses?reset')
// 						.then(() => {
// 							axios.get(data.settings.baseUrl + 'insert/count?reset')
// 								.then(() => {
// 									axios.get(data.settings.newUrl + 'racers/reset')
// 										.then(() => {
// 											resolve();
// 										});
// 								});
// 						});
// 				});
// 		});

// 		handleReset.then(() => {
// 			handleTimers(data.timers);
// 		});
// 	}
// }
// else {
//     data.functions.handleTimers(data, channel, timers, client);
// }

data.debug.write('LAUNCHED');