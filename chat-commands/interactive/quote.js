module.exports = {
	name: 'count',
	description: 'Counter for reasons',
	help: 'Increases a global counter',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				client.optionals++;
				client.say(channel, 'COUNTER: ' + client.optionals);
			},
		},
		set: {
			execute(args, tags, message, channel, client) {
				client.optionals = 0;
				client.say(channel, 'COUNTER RESET TO ' + client.optionals);
			},
		},
		reset: {
			execute(args, tags, message, channel, client) {
				client.optionals = 0;
				client.say(channel, 'COUNTER RESET TO ' + client.optionals);
			},
		},
	},
};