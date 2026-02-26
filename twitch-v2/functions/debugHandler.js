const fs = require('node:fs');
const path = require('node:path');
const util = require('util');

const debug = {
	today: false,
	folder: false,
	file: false,
	stream: false,
	init: function(client) {
		// Setup the folder and create it if it doesn't exists...
		debug.folder = path.join(__dirname, '../debug/') + client.channel.replace('#', '');
		if (!fs.existsSync(debug.folder)) {
			fs.mkdirSync(debug.folder);
		}
	},
	write: function(channel, event, comment = null) {

		// Now set up the file...
		debug.today = new Date().toISOString().split('T')[0];
		debug.file = debug.folder + '/' + debug.today + '.csv';
		debug.stream = fs.createWriteStream(debug.file, { flags: 'a' });

		// Create the entry...
		const now = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace(' ', '_');
		if (typeof debug.stream.write === 'function') {
			debug.stream.write(now + ',' + util.format(channel) + ',' + util.format(event) + ',' + util.format(comment) + '\n');
		}
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return debug;
	},
};