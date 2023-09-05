module.exports = {
	name: 'ping',
	description: 'Says Pong',
	help: 'Just a testing command. Additional arguments: ping, pong',
	actions: {
		default: {
			say: 'Pong',
		},
		ping: {
			help: 'Double ping, double pong',
			say: 'Pong pong',
		},
		pong: {
			help: 'Tag someone in your ping',
			args: {
				1: [ 'r' ],
			},
			execute(args, tags, message, channel, client) {
				client.say(channel, `Hey ${args[2]}, ${tags.username} says PONG at you.`);
			},
		},
	},
};