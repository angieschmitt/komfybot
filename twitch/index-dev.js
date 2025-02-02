const tmi = require('tmi.js');
const axios = require('axios');
// const fs = require('node:fs');
// const path = require('node:path');

// Load in data
const dataFile = require('./data/index');
const data = dataFile.content();

// Set current branch
data.currentBranch = 'dev';

// Define auth for axios stuff
axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

// Connect to Twitch:
const client = new tmi.client(data.settings[ data.currentBranch ]);
client.connect().catch(err => console.log(err));

// Load in the required pieces
data.functions.loadBranch(client, data, data.currentBranch);
data.functions.loadEvents(client);

// Load in local commands and settings
data.functions.loadCommands(client);
data.functions.loadTimers(client);
data.functions.loadSettings(client);

// Pull in the external items
data.functions.loadExternalCommands(client, data);
data.functions.loadExternalTimers(client, data);
data.functions.loadExternalSettings(client, data);

// Start the command refresh check
data.functions.checkForCommandRefresh(data, client);
data.functions.checkForTimerRefresh(data, client);

// Start the timers
data.functions.handleTimers(data, client);

// Occasionally update the token
data.functions.refreshConnection(data, client);

data.debug.write('global', 'LAUNCHED');