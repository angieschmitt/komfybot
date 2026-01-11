module.exports = {
	eventHandler(channel, username, isSelf) {
		console.log(channel + ' : USER_JOIN : ' + username);
		if (isSelf) {
			// console.log('isSelf');
		}
	},
};