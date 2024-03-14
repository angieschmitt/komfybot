const dataFile = require('../data/index');
const data = dataFile.content();

module.exports = {
	eventHandler(channel, username, isSelf) {
		if (isSelf) {
			data.debug.write('LEFT: ' + channel);
		}
	},
};