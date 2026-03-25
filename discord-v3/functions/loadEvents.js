import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function(client){

    // Register Events
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (typeof event.data === "function" && typeof event.execute === "function") { 
            const data = event.data();

            if (data.once) {
                client.bot.once(data.name, (...args) => event.execute(client, ...args));
            }
            else {
                client.bot.on(data.name, (...args) => event.execute(client, ...args));
            }
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "create" or "execute" property.`);
        }
    }

};