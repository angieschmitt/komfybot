const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(channel, username, streakMonths, recipient, methods, tags) {
		const client = this;

		if (client.events['subgift']) {

			let content = client.events['subgift'];
			content = content.replace('{@user}', username);
			content = content.replace('{@recipient}', recipient);
			content = content.replace('{@months}', streakMonths + (streakMonths > 1 ? ' months' : ' month'));

			functions.sayHandler(client, content);
		}

		console.log('caught subgift');
		console.log(channel);
		console.log(username);
		console.log(streakMonths);
		console.log(recipient);
		console.log(methods);
		console.log(tags);
	},
};