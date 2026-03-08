module.exports = {
	eventHandler(channel, username, isSelf) {
		if (!isSelf) {
			// console.log(channel + ' : USER_JOIN : ' + username);
		}
	},
};