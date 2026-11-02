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
            let helpOutput = {};
            let alias = false;

            // Strip out extra !'s
            for (let index = 1; index < args.length; index++) {
                args[index] = args[index].replace('!', '');
            }

            // Check for a matching user command...
            let commandLookup = client.commands['user'][args[1]];

            // No match? Check for a matching global command...
            if (commandLookup === undefined) {
                commandLookup = client.commands['global'][args[1]];
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

                // Default to the top level help details...
                if ('help' in settings){
                    helpOutput.text = settings.help;
                }

                // Default to the top level perm details...
                if ('perms' in settings) {
                    helpOutput.perms = `${settings.perms.levels.join(', ')}`;
                }
                else {
                    const actionData = actions['default'];
                    if ('perms' in actionData){
                        helpOutput.perms = `${actionData.perms.levels.join(', ')}`;
                    }
                }

                // If we have an action, we override that data...
                if (args.length == 3) {
                    if ( Object.keys(actions).includes(args[2]) ){
                        if ('help' in actions[args[2]]){
                            helpOutput.text = actions[args[2]].help;
                        }
                        if ('perms' in actions[args[2]]){
                            helpOutput.perms = `${actions[args[2]].perms.levels.join(', ')}`;
                        }
                    }
                }

                // If we're dealing with a aliased command...
                if (alias){
                    let actionName = settings['aliases'][alias]['arg'];
                    if (!actionName){
                        actionName = 'default';
                    }

                    if ( Object.keys(actions).includes(actionName) ){
                        if ('help' in actions[actionName]){
                            helpOutput.text = actions[actionName].help;
                        }
                        if ('perms' in actions[actionName]){
                            helpOutput.perms = `${actions[actionName].perms.levels.join(', ')}`;
                        }
                    }

                    // Now adjust text to match the alias...
                    helpOutput.text = helpOutput.text.replaceAll('!' + settings.name + ' ' + actionName, '!' + alias);
                }

                if ( Object.keys(helpOutput).length !== 0 ){
                    content = helpOutput.text;
                    
                    if ('perms' in helpOutput){
                        content += ' || ' + helpOutput.perms;
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