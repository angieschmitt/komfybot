module.exports = {
	name: 'help',
	help: 'Provides helpful info for commands',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				let output = '';
				let input = '';
				let command = undefined;
				if (args.length === 1) {
					output = 'Please specify the command you need help with!';
				}
				else if (args.length > 1) {
					if (args[1].indexOf('!') == 0) {
						input = client.commands[args[1].substr(1)];
					}
					else {
						input = client.commands[args[1]];
					}

					let cmdName = false;
					if (input.alias) {
						cmdName = input.alias;
						command = client.commands[input.alias];
						if (input.arg) {
							command = client.commands[input.alias]['actions'][input.arg];
						}
					}
					else {
						cmdName = input.name;
						command = input;
					}

					// Check for level 2?
					if (args[2]) {
						command = command['actions'][args[2]];
					}

					// Output
					let help = command.help;
					if (input.alias) {
						help = help.replace('!' + cmdName, '!' + input.name);
						if (input.arg) {
							help = help.replace('!' + input.name + ' ' + input.arg, '!' + input.name);
						}
					}
					output = help;
				}

				client.say(channel, `${output}`);
			},
		},
	},
};