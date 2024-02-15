module.exports = {
	eventHandler(channel, username, streakMonths, recipient, methods, tags) {
		console.log('caught subgift');
		console.log(username);
		console.log(streakMonths);
		console.log(recipient);
		console.log(methods);
		console.log(tags);
	},
};