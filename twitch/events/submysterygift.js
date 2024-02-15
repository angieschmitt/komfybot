module.exports = {
	eventHandler(channel, username, giftSubCount, methods, tags) {
		console.log('caught submysterygift');
		console.log(username);
		console.log(giftSubCount);
		console.log(methods);
		console.log(tags);
	},
};