module.exports = {
	eventHandler(channel, username, viewers, tags) {
		console.log('caught raid');
		console.log(channel);
		console.log(username);
		console.log(viewers);
		console.log(tags);
	},
};