import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'commands',
    help: 'Outputs a list of available commands. Usage: !commands',
    list: false,
    allowOffline: true,
    aliases: {
        'cmds': {
            arg: false,
            list: true,
        },
    }
};

export const actions = {
    default: {
        execute(args, tags, message, channel, client) {

            let content = client.botName + ' has the following commands: ';

            // Build out the command list
            let commandList = [];

            // If channel has commands, add them to the list
            if (client.commands['user']) {
                Object.entries(client.commands['user']).forEach(([key, value]) => {
                    let cmdOut = true;

                    // If this is a full command...
                    if ('settings' in value) {
                        
                        const settings = value.settings;
                        
                        if ('disabled' in settings) {
                            if (settings.disabled == true) {
                                cmdOut = false;
                            }
                        }
                        if ('list' in settings) {
                            if (settings.list == false) {
                                cmdOut = false;
                            }
                        }
                        if ('allowOffline' in settings) {
                            if (settings.allowOffline == false && client.live == false) {
                                cmdOut = false;
                            }
                        }
                    }
                    // If we're handling an alias...
                    else {
                        if ('disabled' in value) {
                            if (value.disabled == true) {
                                cmdOut = false;
                            }
                        }
                        if ('list' in value) {
                            if (value.list == false) {
                                cmdOut = false;
                            }
                        }
                        if ('allowOffline' in value) {
                            if (value.allowOffline == false && client.live == false) {
                                cmdOut = false;
                            }
                        }
                    }

                    if (cmdOut == true) {
                        commandList.push(key);
                    }
                });
            }
            
            // Chuck the global ones in there too
            Object.entries(client.commands['global']).forEach(([key, value]) => {
                let cmdOut = true;

                // If this is a full command...
                if ('settings' in value) {
                    
                    const settings = value.settings;
                    
                    if ('disabled' in settings) {
                        if (settings.disabled == true) {
                            cmdOut = false;
                        }
                    }
                    if ('list' in settings) {
                        if (settings.list == false) {
                            cmdOut = false;
                        }
                    }
                    if ('allowOffline' in settings) {
                        if (settings.allowOffline == false && client.live == false) {
                            cmdOut = false;
                        }
                    }
                }
                // If we're handling an alias...
                else {
                    if ('disabled' in value) {
                        if (value.disabled == true) {
                            cmdOut = false;
                        }
                    }
                    if ('list' in value) {
                        if (value.list == false) {
                            cmdOut = false;
                        }
                    }
                    if ('allowOffline' in value) {
                        if (value.allowOffline == false && client.live == false) {
                            cmdOut = false;
                        }
                    }
                }

                if (cmdOut == true) {
                    commandList.push(key);
                }
            });

            // Sort them alpha style
            commandList = commandList.sort();
            // Turn it into a string, amd clean it
            commandList.forEach(element => {
                content += '!' + element + ', ';
            });
            content = content.trim().slice(0, -1);

            functions.sayHandler(client, content);
        },
    },
};