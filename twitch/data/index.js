const fs = require('node:fs');
const path = require('node:path');

const settings = require('./settings');
const metronome = require('./metronome');
const reactWords = require('./react-words');
const timers = require('./timers');

// Error logging to file
const today = new Date().toISOString().split('T')[0];
const util = require('util');

const debug = [];
debug.init = function(branch = 'dev') {
	debug.branch = branch;
	debug.file = path.join(__dirname, '../debug/') + today + '_debug-' + debug.branch + '.txt';
	debug.stream = fs.createWriteStream(debug.file, { flags: 'a' });
},
debug.write = function(d) {
	const now = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace(' ', '_');
	debug.stream.write(now + ' : ' + util.format(d) + '\n');
};

const data = {
	settings: settings.content(),
	metronome: metronome.content(),
	reactWords: reactWords.content(),
	timers: timers.content(),
	debug: debug,
};

module.exports = {
	content: function() {
		return data;
	},
};