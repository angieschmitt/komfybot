module.exports = {
	name: 'help',
	description: 'Handy helper command',
	help: 'Provides helpful info for commands',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				let output = '';
				let command = undefined;
				if (args.length === 1) {
					output = 'Please specify the command you need help with!';
				}
				else if (args.length > 1) {
					if (args[1].indexOf('!') == 0) {
						command = client.commands[args[1].substr(1)];
					}
					else {
						command = client.commands[args[1]];
					}

					let alias = false;
					if (command.alias) {
						alias = args[1];
						command = client.commands[command.alias];
					}

					if (!args[2]) {
						if (command.help) {
							if (alias) {
								const help = command.help.replace('!' + command.name, '!' + alias);
								output = '!' + alias + ': ' + help;
							}
							else {
								output = '!' + command.name + ': ' + command.help;
							}
						}
					}

					if (args[2]) {
						if (command.actions[args[2]].help) {
							if (alias) {
								const help = command.actions[args[2]].help.replace('!' + command.name, '!' + alias);
								output = help;
							}
							else {
								output = command.actions[args[2]].help;
							}
						}
					}
				}

				client.say(channel, `${output}`);
			},
		},
	},
};