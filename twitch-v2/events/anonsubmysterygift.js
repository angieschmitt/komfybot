module.exports = {
	eventHandler(channel, giftSubCount, methods, tags) {
		console.log('caught anonsubmysterygift');
		console.log(channel);
		console.log(giftSubCount);
		console.log(methods);
		console.log(tags);
	},
};