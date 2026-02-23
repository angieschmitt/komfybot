module.exports = {
	function(client, channel, message) {

		const channelName = channel.replace('#', '');
		const cleanedMessage = message.trim();

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
			const channelCommands = client.commands['user'];
			if (channelCommands) {
				commandData = module.exports.locateCommand(baseCommand, args, channelCommands);
			}
			if (!commandData) {
				const globalCommands = client.commands['global'];
				commandData = module.exports.locateCommand(baseCommand, args, globalCommands, channelName);
			}
		}

		return commandData;
	},
	locateCommand(command, args, commandMap, channel = false) {

		if (Object.hasOwn(commandMap, command)) {
			let action = {};

			// Check for alias
			if ('alias' in commandMap[command]) {
				if (commandMap[command].arg) {
					args.splice(1, 0, commandMap[command].arg);
				}
				// Swap alias for actual command
				command = commandMap[command].alias;
			}

			// Start with the default action
			action = commandMap[command].actions.default;

			// If global, get channel specific if it exists
			if (channel) {
				if (commandMap[command].actions[channel]) {
					action = commandMap[command].actions[channel];
				}
			}

			// Allow override
			if (args.length !== 1) {
				if (commandMap[command].actions[args[1]]) {
					action = commandMap[command].actions[args[1]];
				}
			}

			// If not enabled, stop here
			if ('enabled' in action) {
				if (!action.enabled) {
					return false;
				}
			}

			return { 'command': commandMap[command], 'action': action, 'args': args, 'channel': (channel ? channel : commandMap[command].channel) };
		}
		else {
			return false;
		}

	},
};