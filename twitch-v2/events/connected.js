const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(addr, port) {
		console.log(`* Connected to ${addr}:${port}`);

		const client = this;

		// One call to load them all...
		functions.dashboardLoad(client);

		// Load in data...
		functions.liveLoad(client, client.userID);
		functions.dataLoad('chatters', client);

		// return client;
	},
};