const tmi = require('tmi.js');
const axios = require('axios');
const fs = require('node:fs');
const path = require('node:path');

const branch = 'live';

// Load in data
const dataFile = require('./data/index');
const data = dataFile.content();

// Handle BAT File args
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
									resolve();
								});
						});
				});
		});

		handleReset.then(() => {
			handleTimers(data.timers);
		});
	}
}
else {
	handleTimers(data.timers);
}

// Connect to Twitch:
const client = new tmi.client(data.settings[branch]);
client.connect().catch(console.error);

// Set up local variables
client.extras = [];
client.last_message = [];

// Individual versions of those variables
data.settings[branch]['channels'].forEach(channel => {
	client.extras[channel.replace('#', '')] = [];
	client.extras[channel.replace('#', '')].race = [];
	client.extras[channel.replace('#', '')].guessActive = [];
	client.last_message[channel.replace('#', '')] = '';
});

// Assign Events
const eventsPath = path.join(__dirname, 'events');
const eventFolders = fs.readdirSync(eventsPath);
for (const file of eventFolders) {
	const eventName = path.parse(file).name;
	const filePath = path.join(eventsPath, file);
	const eventData = require(filePath);
	client.on(eventName, eventData.eventHandler);
}

// Assign Commands
client.commands = new Array();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

//	- Skip aliases
for (const folder of commandFolders) {
	if (folder !== 'aliases') {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			if (command.disabled !== true) {
				client.commands[command.name] = command;
			}
		}
	}
}

//  - Now we handle aliases
for (const folder of commandFolders) {
	if (folder === 'aliases') {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			if (command.alias in client.commands) {
				client.commands[command.name] = command;
			}
		}
	}
}

//  - Order them alpha
const ordered = Object.keys(client.commands).sort().reduce(
	(obj, key) => {
		obj[key] = client.commands[key];
		return obj;
	},
	{},
);
client.commands = ordered;

// Extra functions
const isObjectEmpty = (objectName) => {
	return Object.keys(objectName).length === 0 && objectName.constructor === Object;
};

function liveCheck(channel, extra = false) {
	const chan = channel.toLowerCase();
	return axios.get(data.settings.newUrl + 'live_check/insert')
		.then(function(res) {
			const resData = res.data;
			const response = [];
			// eslint-disable-next-line
			if (resData.response.hasOwnProperty(chan)) {
				response.live = true;
			}
			else {
				response.live = false;
			}

			if (extra) {
				response.extra = extra;
			}

			return response;
		});
}

function handleTimers(timersAll) {
	const timerInterval = 60000;
	let timerOffset = 1;
	axios.get(data.settings.baseUrl + 'retrieve/uptime')
		.then(function(response) {
			if (response.data.status === 'success') {
				timerOffset = (response.data.minutes > 0 ? response.data.minutes : 1);
			}
		})
		.catch(console.error)
		.finally(() => {
			const queue = {};
			Object.entries(timersAll).forEach(([channel]) => {
				queue[channel] = [];
			});
			setInterval(
				function() {
					console.log('Timer: ' + timerOffset);

					// Enter messages into queue
					Object.entries(timersAll).forEach(([channel]) => {
						const timers = timersAll[channel];
						Object.entries(timers).forEach(([key]) => {
							if ((timerOffset % timers[key]['timer']) == 0) {
								if (isObjectEmpty(queue[channel])) {
									queue[channel][key] = timers[key];
								}
								else {
									const first = Object.keys(queue[channel])[0];
									delete queue[channel][first];
									queue[channel][key] = timers[key];
								}
							}
						});
					});

					// Handle queue
					Object.entries(queue).forEach(([channel]) => {
						Object.entries(queue[channel]).forEach(([ident]) => {
							const messageData = queue[channel][ident];
							if (client.last_message !== messageData['message']) {
								liveCheck(channel, messageData).then(res => {
									if (res.live === true) {
										console.log('Timer: SENT');
										client.say(channel, res.extra['message']);
										console.log('- - -');
										queue[channel] = [];
									}
									else {
										console.log('Timer: SKIPPED - not live');
										console.log('- - -');
										queue[channel] = [];
									}
								});
							}
						});
					});
					timerOffset++;
				},
				timerInterval,
			);
		});
}
