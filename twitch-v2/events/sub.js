const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(channel, username, methods, message, tags) {
		const client = this;

		if (client.events['sub']) {

			let content = client.events['sub'];
			content = content.replace('{@user}', username);

			functions.sayHandler(client, content);
		}

		console.log('caught sub');
		console.log(channel);
		console.log(username);
		console.log(methods);
		console.log(message);
		console.log(tags);
	},
};