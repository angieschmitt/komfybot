const fs = require('node:fs');
const path = require('node:path');

// Error logging to file
const today = new Date().toISOString().split('T')[0];
const util = require('util');

const errorMessage = {
	branch: false,
	file: false,
	stream: false,
	init: function(branch = 'dev') {
		errorMessage.branch = branch;
		errorMessage.file = path.join(__dirname, '../errors/') + today + '_errors-' + errorMessage.branch + '.csv';
		errorMessage.stream = fs.createWriteStream(errorMessage.file, { flags: 'a' });
	},
	handle: function(channel, client, event = '', comment = null) {
		const now = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace(' ', '_');
		if (typeof errorMessage.stream.write === 'function') {
			errorMessage.stream.write(now + ',' + util.format(channel) + ',' + util.format(event) + ',' + util.format(comment) + '\n');
			client.say(channel, event + ' errorMsg: ' + comment);
		}
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return errorMessage;
	},
};