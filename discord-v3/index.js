import { Client, Partials, GatewayIntentBits } from 'discord.js';

import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const settingsFile = require('./settings');
const settings = settingsFile.default();

// Create a new client instance
const client = {};

client.bot = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Slap some settings onto the client for use...
client.userID = settings.userID;
client.endpoint = settings.endpoint;
client.socketInfo = settings.socket[ settings.env ];
client.twitchID = settings.twitchClientID;

// Register Functions... this lives here so that it can be used in functions...
client.functions = {};
const functionsPath = path.join(__dirname, 'functions');
const functionsFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));
for (const file of functionsFiles) {
	const funcName = path.parse(file).name;
	const filePath = path.join(functionsPath, file);
	const funcFunc = require(filePath);

    if ( funcFunc.default ){
    	client.functions[funcName] = funcFunc.default;
    }
    else {
        client.functions[funcName] = {};
        Object.entries(funcFunc).forEach(([name, func]) => {
            client.functions[name] = func;
        })
    }
}

// Now create the bot...
client.functions.createBot(client);