const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	function(client) {
		const eventsPath = path.join(__dirname, '../events');
		const eventFolders = fs.readdirSync(eventsPath);
		for (const file of eventFolders) {
			const eventName = path.parse(file).name;
			const filePath = path.join(eventsPath, file);
			const eventData = require(filePath);
			client.on(eventName, eventData.eventHandler);
		}

		return client;
	},
};