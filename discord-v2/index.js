const fs = require('node:fs');
const path = require('node:path');

const settingsFile = require('./settings');
const settings = settingsFile.content();

// Require the necessary discord.js classes
const { Client, Partials, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Slap some settings onto the client for use...
client.userID = settings.userID;
client.endpoint = settings.endpoint;
client.socketInfo = settings.socket[ settings.env ];

// Register Functions... this lives here so that it can be used in functions...
client.functions = {};
const functionsPath = path.join(__dirname, 'functions');
const functionsFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));
for (const file of functionsFiles) {
	const funcName = path.parse(file).name;
	const filePath = path.join(functionsPath, file);
	const funcFunc = require(filePath);
	client.functions[funcName] = funcFunc.function;
}

// Now create the bot...
client.functions.createBot(client);