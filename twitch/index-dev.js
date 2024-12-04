const tmi = require('tmi.js');
const axios = require('axios');
// const fs = require('node:fs');
// const path = require('node:path');

const branch = 'dev';

// Load in data
const dataFile = require('./data/index');
const data = dataFile.content();

// Define auth for axios stuff
axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

// Connect to Twitch:
const client = new tmi.client(data.settings[branch]);
client.connect().catch(err => console.log(err));

data.functions.loadBranch(client, data, branch);
data.functions.loadEvents(client);
data.functions.loadCommands(client);
data.functions.loadExternalCommands(client, data);
data.functions.loadSettings(client);
data.functions.loadExternalSettings(client, data);

// Start the command refresh check
data.functions.checkForCommandRefresh(data, client);

// Start the timers
// data.functions.handleTimers(data, data.timers, client);

data.debug.write('global', 'LAUNCHED');