const fs = require('node:fs');
const path = require('node:path');

// Error logging to file
const today = new Date().toISOString().split('T')[0];
const util = require('util');

const debug = {
	branch: false,
	file: false,
	stream: false,
	init: function(branch = 'dev') {
		debug.branch = branch;
		debug.file = path.join(__dirname, '../debug/') + today + '_debug-' + debug.branch + '.txt';
		debug.stream = fs.createWriteStream(debug.file, { flags: 'a' });
	},
	write: function(d) {
		const now = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace(' ', '_');
		debug.stream.write(now + ' : ' + util.format(d) + '\n');
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return debug;
	},
};