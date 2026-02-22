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

		// In case we need it...
		let passive = true;

		// Log chatters...
		functions.dataChatters(client, channel, tags);

		// Handle commands...
		const commandData = functions.messageLocateCommand(client, channel, message);
		if (commandData) {
			if (functions.commandsHandler(commandData, channel, perms, tags, message, client)) {
				console.log('Used command: ' + commandData.command.name + ' ' + (commandData.args[1] ? commandData.args[1] : ''));
			}

			// Commands don't give passive...
			passive = false;
		}

		// Handle reactwords...
		const reactwordCheck = functions.messageLocateReactword(client, channel, message, tags);
		if (reactwordCheck) {
			const chosen = functions.funcRandomProperty(reactwordCheck);
			functions.sayHandler(client, chosen);
		}

		// Chaos Mode stuff...
		if ('chaosMode' in client.redeems.states) {
			if (client.redeems.states.chaosMode) {
				const cleanedMessage = message.trim();
				// If a single word...
				if (!cleanedMessage.includes(' ')) {
					// If it's in the channels chaos words...
					if (cleanedMessage.toLowerCase() in client.data.chaosMode) {
						// Pass it off to the websocket...
						client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'content' : client.data.chaosMode[cleanedMessage.toLowerCase()], 'type' : 'chat', 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));

						// Chaos-mode doesn't give passive...
						passive = false;
					}
				}
			}
		}

		// Handle passive income...
		if (client.settings.currency.enabled) {
			if (client.settings.passive.enabled) {
				if (!commandData) {
					if (client.isLive) {
						if (passive) {
							functions.messageHandlePassive(client, channel, message, tags, perms);
						}
					}
				}
			}
		}

	},
};