module.exports = {
	eventHandler(channel, username, methods, message, tags) {
		console.log('caught sub');
		console.log(channel);
		console.log(username);
		console.log(methods);
		console.log(message);
		console.log(tags);
	},
};