const functions = require('./functions');
const settings = require('./settings');
const metronome = require('./metronome');
const reactWords = require('./react-words');
const timers = require('./timers');

const data = {
	functions: functions.content(),
	settings: settings.content(),
	metronome: metronome.content(),
	reactWords: reactWords.content(),
	timers: timers.content(),
};

module.exports = {
	content: function() {
		return data;
	},
};