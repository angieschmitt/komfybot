const dataFile = require('../data/index');
const data = dataFile.content();

module.exports = {
	eventHandler(addr, port) {
		console.log(`* Connected to ${addr}:${port}`);
		data.debug.write('global', 'CONNECTED', `${addr}:${port}`);
	},
};