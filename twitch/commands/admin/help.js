module.exports = {
	name: 'help',
	help: 'Provides helpful info for commands',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let output = '';
				let input = '';
				if (args.length === 1) {
					output = 'Please specify the command you need help with!';
				}
				else if (args.length > 1) {
					if (args[1].indexOf('!') == 0) {
						input = args[1].substr(1);
					}
					else {
						input = args[1];
					}

					// Locate command
					let command = false;
					let location = false;
					// -- Check channel commands, if there are any
					if (client.commands[channel.replace('#', '')]) {
						if (input in client.commands[channel.replace('#', '')]) {
							command = client.commands[channel.replace('#', '')][input];
							location = channel.replace('#', '');
						}
					}
					// -- If it hasn't been located, check global commands
					if (!command) {
						if (input in client.commands['global']) {
							command = client.commands['global'][input];
							location = 'global';
						}
					}

					// If we found it, now we dig deeper
					let help = false;
					if (command) {
						// If this is aliased, snag the REAL command
						let origCommand = false;
						if (command.alias) {
							origCommand = command;
							command = client.commands[location][command.alias];
						}

						// Build the help command
						if (command.help) {
							help = command.help;
						}
						// -- If there was an alias
						if (origCommand.alias) {
							// -- Check for routing to a specific argument
							if (origCommand.arg) {
								const arg = origCommand.arg;
								if (command.actions[arg].help) {
									help = command.actions[arg].help;
								}
							}
						}
						// -- If there was a sub argument
						if (args[2]) {
							if (command.actions[args[2]].help) {
								help = command.actions[args[2]].help;
							}
						}

						// Swap words based on alias
						if (origCommand.alias) {
							help = help.replace('!' + origCommand.alias, '!' + input);
							if (origCommand.arg) {
								help = help.replace('!' + input + ' ' + origCommand.arg, '!' + input);
							}
						}
					}

					if (help) {
						output = help;
					}
				}

				client.say(channel, `${output}`);
			},
		},
	},
};