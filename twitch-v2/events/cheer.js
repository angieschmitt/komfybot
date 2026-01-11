module.exports = {
	eventHandler(channel, tags, message) {
		console.log('caught cheer');
		console.log(channel);
		console.log(tags);
		console.log(message);
	},
};