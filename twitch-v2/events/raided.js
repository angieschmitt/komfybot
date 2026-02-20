const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(channel, username, viewers, tags) {
		const client = this;

		if (client.events['raided']) {

			let content = client.events['raided'];
			content = content.replace('{@user}', '@' + username);
			content = content.replace('{@viewers}', viewers + (viewers > 1 ? ' viewers' : ' viewer'));

			functions.sayHandler(client, content);
		}

		console.log('caught raid');
		console.log(channel);
		console.log(username);
		console.log(viewers);
		console.log(tags);
	},
};