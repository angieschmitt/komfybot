import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function eventLoader(client){

    // If the data bucket doesn't exist...
    if (!('eventHandlers' in client)) {
        client.eventHandlers = [];
        client.eventHandlers.chatClient = [];
        client.eventHandlers.eventSub = [];
    }

    // Load in eventsub events...
    const eventsubEventsPath = path.join(__dirname, '../events/eventSub');
    const eventsubEventsFolder = fs.readdirSync(eventsubEventsPath);
    for (const file of eventsubEventsFolder) {
        const eventName = path.parse(file).name;
        const filePath = path.join(eventsubEventsPath, file);
        const eventData = require(filePath);

        client.eventHandlers.eventSub[eventName] = client.eventsubListener[eventName](client.twitchUUID, event => {
            eventData.default(event, client);
        });
    }

    // Load in chatclient events...
    const chatEventsPath = path.join(__dirname, '../events/chatClient');
    const chatEventsFolders = fs.readdirSync(chatEventsPath);
    for (const file of chatEventsFolders) {
        const eventName = path.parse(file).name;
        const filePath = path.join(chatEventsPath, file);
        const eventData = require(filePath);

        client.eventHandlers.chatClient[eventName] = client.chatClient[eventName](async (...args) => {
            eventData.default(...args, client);
        });
    }

    return client;
    
}