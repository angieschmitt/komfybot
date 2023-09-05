module.exports = {
	name: 'commands',
	description: 'Outputs a command list',
	help: 'Outputs a list of available commands',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let output = 'KomfyBot has the following commands: ';
				for (const [key] of Object.entries(client.commands)) {
					output += '!' + key + ', ';
				}
				output = output.trim().slice(0, -1);

				client.say(channel, `${output}. For more information, use !help <command>.`);
			},
		},
	},
};