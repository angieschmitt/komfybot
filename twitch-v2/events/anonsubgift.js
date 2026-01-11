module.exports = {
	eventHandler(channel, streakMonths, recipient, methods, tags) {
		console.log('caught anonsubgift');
		console.log(channel);
		console.log(streakMonths);
		console.log(recipient);
		console.log(methods);
		console.log(tags);
	},
};