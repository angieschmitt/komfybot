import { REST, Routes } from 'discord.js';

import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function(client){

    // Assign Commands
    client.commands = { 'list': [], 'data': [] };
    client.commands['list'] = [];
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if (typeof command.create === "function" && typeof command.execute === "function") { 
                const data = command.create();
                client.commands['list'].push( data.toJSON() );
                client.commands['data'][data.name] = { 'data' : data.toJSON(), 'execute' : command.execute, 'autocomplete': command.autocomplete };
            }
            else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "create" or "execute" property.`);
            }
        }
    }

    const rest = new REST().setToken(client.token);

    // and deploy your commands!
    (async (client) => {
        try {
            console.log(`Started refreshing ${Object.keys(client.commands.list).length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(Routes.applicationCommands(client.clientID, client.guildID), { body: client.commands.list });

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })(client);

    return client;

}
