const functions = require('./functions');
const settings = require('./settings');
const debug = require('./debug');
const metronome = require('./metronome');
const reactWords = require('./react-words');
const firstMessage = require('./on_first_message');
const timers = require('./timers');

const data = {
	functions: functions.content(),
	settings: settings.content(),
	metronome: metronome.content(),
	reactWords: reactWords.content(),
	firstMessage: firstMessage.content(),
	timers: timers.content(),
	debug: debug.content(),
};

module.exports = {
	content: function() {
		return data;
	},
};