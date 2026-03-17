import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'help',
	help: 'Provides helpful info for commands. Usage: !help <command:required>',
    list: true,
    allowOffline: true,
    aliases: {}
};

export const actions = {
    default: {
        args: {
            required: [ 1 ],
            error: 'don\'t forgot the command!',
        },
        execute(args, tags, message, channel, client) {

            let content = '';

            let commandLookup = client.commands['user'][args[1]];
            if (commandLookup === undefined) {
                commandLookup = client.commands['global'][args[1]];
            }

            // If we found... something...
            if (commandLookup !== undefined) {
                // If no actions, we have an alias..
                if (!('actions' in commandLookup)) {
                    let commandLookup2 = client.commands['user'][commandLookup.alias];
                    if (commandLookup2 === undefined) {
                        commandLookup2 = client.commands['global'][commandLookup.alias];
                    }
                    if (commandLookup2 !== undefined) {
                        commandLookup = commandLookup2;
                    }
                }
            }

            // If we have a proper command now...
            if (commandLookup !== undefined) {
                const actions = commandLookup.actions;
                const settings = commandLookup.settings;

                if ('help' in settings) {
                    content = `!${args[1]} : ${settings.help.replace('!' + settings.name, '!' + args[1])}`;
                    
                    if (args.length == 3) {
                        const actionData = actions[args[2]];
                        if ('help' in actionData) {
                            content = `!${args[1]} ${args[2]} : ${actionData.help.replace('!' + settings.name, '!' + args[1])}`;
                        }
                    }
                }
                else {
                    content = 'User generated commands do not have help text';
                }
            }
            // If not, we output a placeholder message...
            else {
                content = 'User generated commands do not currently have help text';
            }
            
            functions.sayHandler(client, content);
        },
    },
};