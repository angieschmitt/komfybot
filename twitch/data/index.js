const functions = require('./functions');
const settings = require('./settings');
const debug = require('./debug');
const errorMsg = require('./error');
const metronome = require('./metronome');
const reactWords = require('./react-words');
const chaosWords = require('./chaos-words');
const firstMessage = require('./on_first_message');
const timers = require('./timers');

const data = {
	functions: functions.content(),
	settings: settings.content(),
	metronome: metronome.content(),
	reactWords: reactWords.content(),
	chaosWords: chaosWords.content(),
	firstMessage: firstMessage.content(),
	timers: timers.content(),
	debug: debug.content(),
	errorMsg: errorMsg.content(),
};

module.exports = {
	content: function() {
		return data;
	},
};