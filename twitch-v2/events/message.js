const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(channel, tags, message, self) {

		// Shared chat is active...
		if ('source-room-id' in tags) {
			// If these ids aren't the same, we don't do anything...
			if (tags['room-id'] !== tags['source-room-id']) {
				return;
			}
		}

		// We don't talk to ourselves...
		if (self) {
			return;
		}

		// Populate some things we'll need...
		const client = this;
		const perms = functions.messagePermissions(channel, tags);

		// Log chatters...
		functions.dataChatters(client, channel, tags);

		// Handle commands...
		const commandData = functions.messageLocateCommand(client, channel, message);
		if (commandData) {
			if (functions.commandsHandler(commandData, channel, perms, tags, message, client)) {
				console.log('Used command: ' + commandData.command.name + ' ' + (commandData.args[1] ? commandData.args[1] : ''));
			}
		}

		// Handle reactwords...
		const reactwordCheck = functions.messageLocateReactword(client, channel, message, tags);
		if (reactwordCheck) {
			const chosen = functions.funcRandomProperty(reactwordCheck);
			client.say(channel, chosen);
		}

		// Handle passive income...
		if (client.settings.currency.enabled) {
			if (client.settings.passive.enabled) {
				if (!commandData) {
					if (client.isLive) {
						functions.messageHandlePassive(client, channel, message, tags, perms);
					}
				}
			}
		}

	},
};