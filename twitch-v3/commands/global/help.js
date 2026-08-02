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
            let alias = false;

            // Strip out extra !'s
            for (let index = 1; index < args.length; index++) {
                args[index] = args[index].replace('!', '');
            }

            // Check for a matching user command...
            let commandLookup = client.commands['user'][args[1]];
            // No match? Check for a matching global command...
            if (commandLookup === undefined) {
                let commandLookup = client.commands['global'][args[1]];
            }
            // Still no match? Check the aliases list...
            if (commandLookup === undefined) {
                commandLookup = client.commands['alias'][args[1]];

                // If we match here, we need to locate the parent command...
                if (commandLookup){
                    alias = args[1];
                    // Try to locate the parent in user commands...
                    let commandLookup2 = client.commands['user'][ commandLookup['settings']['name']];
                    // No match? Check for parent in global commands...
                    if (commandLookup2 === undefined) {
                        commandLookup2 = client.commands['global'][ commandLookup['settings']['name']];
                    }

                    // Now, overwrite the main command if we found a match...
                    if (commandLookup2 !== undefined) {
                        commandLookup = commandLookup2;
                    }
                }
            }

            // If we have a proper command now...
            if (commandLookup !== undefined) {
                const actions = commandLookup.actions;
                const settings = commandLookup.settings;

                if (alias) {
                    let actionName = settings['aliases'][alias]['arg'];
                    if (!actionName){
                        actionName = 'default';
                    }
                    const actionData = actions[actionName];

                    if ('help' in actionData){
                        let adjusted = actionData.help.replaceAll('!' + settings.name + ' ' + actionName, '!' + alias);
                        content = `!${args[1]} : ${adjusted}`;
                    } else if ('help' in settings) {
                        content = `!${args[1]} : ${settings.help.replaceAll('!' + settings.name, '!' + args[1])}`;
                    }

                    if (content !== ''){
                        if ('perms' in actionData){
                            content += ` || ${actionData.perms.levels.join(', ')}`;
                        } else if ('perms' in settings) {
                            content += ` || ${settings.perms.levels.join(', ')}`;
                        }
                    }

                }
                else {
                    // If we have a top level command...
                    if (args.length == 2) {
                        if ('help' in settings) {
                            content = `!${args[1]} : ${settings.help.replaceAll('!' + settings.name, '!' + args[1])}`;
                        }

                        if (content !== ''){
                            if ('perms' in actions['default']){
                                content += ` || ${actions['default'].perms.levels.join(', ')}`;
                            }
                            else if ('perms' in settings){
                                content += ` || ${settings.perms.levels.join(', ')}`;
                            }
                        }
                    }
                    // If we have MORE data, we dig...
                    else {
                        const actionData = actions[args[2]];
                        if ('help' in actionData) {
                            content = `!${args[1]} ${args[2]} : ${actionData.help.replaceAll('!' + settings.name, '!' + args[1])}`;

                            if ('perms' in actionData){
                                content += ` || ${actionData.perms.levels.join(', ')}`;
                            }
                        }
                    }
                }
                
                // Fall back if we haven't set content...
                if (content === '') {
                    content = `There doesn't seem to be help text for this command.`;
                }
            }
            // If not, we output the placeholder message...
            else {
                content = `There doesn't seem to be help text for this command.`;
            }
            
            functions.sayHandler(client, content);
        },
    },
};