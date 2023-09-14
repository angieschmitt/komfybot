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
					if (args[1].indexOf('!') == 0) { command = client.commands[args[1].substr(1)]; }
					else { command = client.commands[args[1]]; }

					if (!args[2]) {
						output = '!' + command.name + ': ' + command.help;
					}
					else {
						output = command.actions[args[2]].help;
					}
				}

				client.say(channel, `${output}`);
			},
		},
	},
};