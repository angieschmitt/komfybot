// Discord Stuff
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Partials, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('/etc/secrets/config.json');
// const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Assign Commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Register Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);

// Webserver stuff
const express = require('express');
const server = express();
const port = process.env.PORT || 3001;

server.get('/', (req, res) => res.type('html').send('<html><body><h1>Page?</h1></body></html>'));
server.get('/healthy', (req, res) => res.status(200).type('html').send('<html><body><h1>Healthy</h1></body></html>'));
server.listen(port, () => console.log(`Example app listening on port ${port}!`));