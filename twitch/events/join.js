// const fs = require('node:fs');
// const path = require('node:path');

module.exports = {
	eventHandler(channel, username, isSelf) {
		if (isSelf) {
			if (channel === '#komfykiwi') {
				// client.say('komfykiwi', 'I\'m here boss! Got my cocoa and blankie!');
			}
		}
	},
};