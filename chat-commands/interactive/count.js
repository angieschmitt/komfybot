module.exports = {
	name: 'count',
	description: 'Counter for reasons',
	help: 'Outputs the current value of the counter. Additional arguments: set, reset',
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				client.extras.count++;
				client.say(channel, 'COUNTER: ' + client.extras.count);
			},
		},
		set: {
			help: 'MOD command to fix the amount on the counter. !count set <number:required>',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				client.extras.count = args[2];
				client.say(channel, 'COUNTER: ' + client.extras.count);
			},
		},
		reset: {
			help: 'MOD command to reset the amount on the counter. !count reset',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {
				client.extras.count = 0;
				client.say(channel, 'COUNTER RESET');
			},
		},
	},
};