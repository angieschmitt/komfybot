const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(addr, port) {
		const client = this;

		console.log(`* Connected to ${addr}:${port}`);

		functions.dataLoad('chatters', client);
	},
};