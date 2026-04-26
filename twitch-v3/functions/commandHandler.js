export async function commandLocator(text, client) {
    const parent = this;

    const cleanedMessage = text.trim();
    
    // Check for a command...
    let commandData = false;
    if (cleanedMessage.indexOf('!') !== -1) {

        // Remove preceding text
        const commandText = cleanedMessage.substr(cleanedMessage.indexOf('!'));

        // Split remaing text into parts to handle things
        const args = commandText.split(' ');

        // Define the main command
        const baseCommand = args[0].substring(1).toLowerCase();

        // Define command buckets
        const globalCommands = client.commands['global'];
        const userCommands = client.commands['user'];
        const aliasCommands = client.commands['alias'];
        if (baseCommand in globalCommands) {
            commandData = parent.loadCommandData(baseCommand, args, 'global', client.commands);
        }
        else if (baseCommand in userCommands) {
            commandData = parent.loadCommandData(baseCommand, args, 'user', client.commands);
        }
        else if (baseCommand in aliasCommands) {
            commandData = parent.loadCommandData(baseCommand, args, 'alias', client.commands);
        }
    }
    
    return commandData;

}

export async function loadCommandData(command, args, type, commandsList) {

    if (Object.hasOwn(commandsList[type], command)) {
        let action = {};
        
        // Isolate the type list..
        let commandsTypeList = commandsList[type];

        // Set the command to the provided one, and get the settings...
        let commandDetails = commandsTypeList[command];
        let settings = commandDetails.settings;

        // If we're handling an alias, hunt down the real command...
        if (type == 'alias'){

            // Slap in the arg that we need...
            if (settings.arg) {
                args.splice(1, 0, settings.arg);
            }

            if ( settings.name in commandsList.global ){
                commandDetails = commandsList.global[ settings.name ];
                settings = commandDetails.settings;
            }
            else if ( settings.name in commandsList.user ){
                commandDetails = commandsList.user[ settings.name ];
                settings = commandDetails.settings;
            }
        }

        // Start with the default action
        action = commandDetails.actions.default;

        // Allow override
        if (args.length !== 1) {
            if (commandDetails.actions[args[1]]) {
                action = commandDetails.actions[args[1]];
            }
        }

        // If not enabled, stop here
        if ('enabled' in action) {
            if (!action.enabled) {
                return false;
            }
        }

        const commandOutput = {
            'action': action,
            'args': args,
            'settings': commandDetails.settings
        };

        return commandOutput;
    }
    else {
        return false;
    }

};

export async function commandHandler(command, perms, channel, user, text, msg, client) {
    const parent = this;

    const settings = command.settings;
    const action = command.action;
    const args = command.args;

    const tags = []
    tags.username = msg.userInfo.userName;
    tags['user-id'] = msg.userInfo.userId;

    // Check for allowOffline...
    if ('allowOffline' in settings) {
        // If allowOffline is false...
        if (!settings.allowOffline) {
            // And user isn't live...
            if (!client.isLive) {
                const content = 'This command cannot be used while the streamer is offline.';
                parent.sayHandler(client, content);
                return;
            }
        }
    }

    // Handle basic actions
    if ('say' in action) {
        let output = action.say[0];
        let proceed = true;

        // Handle perms/proceed, assign output if needed
        if (action.perms && action.perms !== undefined) {
            let hasPerm = false;
            action.perms['levels'].forEach((perm) => {
                if (perms[perm]) {
                    hasPerm = true;
                }
            });
            if (!hasPerm) {
                output = `@${tags.username}, ${action.perms.error}`;
                proceed = false;
            }
        }

        // Handle the args...
        if (proceed) {
            if (action.args) {
                if ('required' in action.args) {
                    Object.entries(action.args.required).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
                        if (!(value in args)) {
                            proceed = false;
                        }
                    });
                }
                if (!proceed) {
                    output = `${tags.username}, ${action.args.error}`;
                }
            }
        }

        // Handle cleaning the message...
        if (proceed) {
            output = parent.replaceContentInMessage(output, args, tags);
            if (output === false) {
                const content = 'You are missing a target for that command.';
                parent.sayHandler(client, content);
                return true;
            }
        }

        // Output output...
        parent.sayHandler(client, output);
        return true;
    }
    else if ('random' in action) {

        // Strip out content with {@target} if there isn't one...
        let randomList = Array.from(action.random);
        if (args.length == 1) {
            for (let i = randomList.length - 1; i >= 0; i--) {
                if (randomList[i].indexOf('{@target}') != -1) {
                    randomList.splice(i, 1);
                }
            }
        }

        if (randomList.length == '0') {
            randomList = action.random;
        }

        // Select a random entry...
        let output = parent.randomObjValue(parent.shuffleObject(randomList));
        let proceed = true;

        // Handle perms/proceed, assign output if needed
        if (action.perms && action.perms !== undefined) {
            let hasPerm = false;
            action.perms['levels'].forEach((perm) => {
                if (perms[perm]) {
                    hasPerm = true;
                }
            });
            if (!hasPerm) {
                output = `@${tags.username}, ${action.perms.error}`;
                proceed = false;
            }
        }

        // Handle the args...
        if (proceed) {
            if (action.args) {
                if ('required' in action.args) {
                    Object.entries(action.args.required).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
                        if (!(value in args)) {
                            proceed = false;
                        }
                    });
                }
                if (!proceed) {
                    output = `${tags.username}, ${action.args.error}`;
                }
            }
        }

        // Handle cleaning the message...
        if (proceed) {
            output = parent.replaceContentInMessage(output, args, tags);
            if (output === false) {
                const content = 'You are missing a target for that command.';
                parent.sayHandler(client, content);
                return true;
            }
        }

        // Output output...
        parent.sayHandler(client, output);
        return true;
    }
    else if ('delayed' in action) {

        // Handle perms/proceed, die here if bad...
        if (action.perms && action.perms !== undefined) {
            let hasPerm = false;
            action.perms['levels'].forEach((perm) => {
                if (perms[perm]) {
                    hasPerm = true;
                }
            });
            if (!hasPerm) {
                const output = `@${tags.username}, ${action.perms.error}`;
                parent.sayHandler(client, output);
                return false;
            }
        }

        // Check for required targets...
        const entries = Object.entries(action.delayed);
        for (let i = 0; i < entries.length; i++) {
            const [idx, data] = entries[i]; // eslint-disable-line no-unused-vars
            const check = parent.replaceContentInMessage(data[0], args, tags);
            if (check === false) {
                const content = 'You are missing a target for that command.';
                parent.sayHandler(client, content);
                return true;
            }
        }

        // If we've made it here...
        let delay = 0;
        const uniqueID = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
        Object.entries(action.delayed).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
            // Assign a name to the timers...
            const timerName = settings.name + '-Timer-' + idx + '_' + uniqueID;
            // Create the delays...
            client.timeouts.make(
                timerName,
                () => {
                    const content = parent.replaceContentInMessage(data[0], args, tags);
                    if (content !== '') {
                        parent.sayHandler(client, parent.replaceContentInMessage(data[0], args, tags));
                    }
                    client.timeouts.clear(timerName);
                },
                (delay * 1000),
            );
            // Increase the delay...
            delay += parseInt(data[1]);
        });

        return true;
    }
    else if ('execute' in action) {
        let output = '';
        let proceed = true;

        // Handle perms/proceed, assign output if needed
        if (action.perms && action.perms !== undefined) {
            let hasPerm = false;
            action.perms['levels'].forEach((perm) => {
                if (perms[perm]) {
                    hasPerm = true;
                }
            });
            if (!hasPerm) {
                output = `@${tags.username}, ${action.perms.error}`;
                proceed = false;
            }
        }

        // Handle the action now
        if (proceed) {
            if (action.args) {

                if ('required' in action.args) {
                    Object.entries(action.args.required).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
                        if (!(value in args)) {
                            proceed = false;
                        }
                    });
                }
                if (!proceed) {
                    output = `${tags.username}, ${action.args.error}`;
                }

            }
        }

        // Handle cleaning the message...
        if (proceed) {
            output = parent.replaceContentInMessage(output, args, tags);
            if (output === false) {
                const content = 'You are missing a target for that command.';
                parent.sayHandler(client, content);
                return true;
            }
        }

        // If no output, execute the command...
        if (!output) {
            action.execute(args, tags, text, channel, client);
            return true;
        }
        // Otherwise, output output...
        else {
            parent.sayHandler(client, output);
            return true;
        }
    }
};

export function replaceContentInMessage(message, args, tags) {
    const parent = this;

    // map to output
    let messageCleaned = message.trim();

    // If there is actually a message...
    if (messageCleaned !== '') {
        // Handle special tags in message
        if (messageCleaned.indexOf('{@sender}') !== -1) {
            messageCleaned = message.replace('{@sender}', '@' + tags.username);
        }
        if (messageCleaned.indexOf('{@target}') !== -1) {
            if (args.length > 1) {
                messageCleaned = messageCleaned.replace('{@target}', args[1]);
            }
            else {
                return false;
            }
        }
    }

    return messageCleaned;
};