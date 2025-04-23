const tmi = require('tmi.js');
const axios = require('axios');

// Load in data
const dataFile = require('./data/index');
const data = dataFile.content();

// Set current branch
data.currentBranch = 'live';

// Define axios stuff
axios.defaults.headers.common['Authorization'] = data.settings.apiKey;
// axios.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
// axios.defaults.headers.common['Pragma'] = 'no-cache';
// axios.defaults.headers.common['Expires'] = '0';

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

// Connect to the websocket?
const identifier = 'komfybot';
const websocket = new WebSocket('ws://64.176.216.41:8080/' + identifier);

websocket.onopen = () => {
	websocket.send(JSON.stringify({ 'action': 'refresh', 'source': identifier }));
	data.debug.write('global', 'WEBSOCKET_CONNECTED');

	// Start the channel points watcher
	data.functions.handleChannelPoints(data, websocket);
};

websocket.onmessage = (event) => {
	const data = JSON.parse(event.data);
	console.log(data);
};

// Start the timers
data.functions.handleTimers(data, client);

// Occasionally update the token
data.functions.refreshConnection(data, client);

data.debug.write('global', 'LAUNCHED');