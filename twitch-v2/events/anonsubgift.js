const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(channel, streakMonths, recipient, methods, tags) {
		const client = this;

		if (client.events['anonsubgift']) {

			let content = client.events['anonsubgift'];
			content = content.replace('{@recipient}', recipient);
			content = content.replace('{@months}', streakMonths + (streakMonths > 1 ? ' months' : ' month'));

			functions.sayHandler(client, content);
		}

		console.log('caught anonsubgift');
		console.log(channel);
		console.log(streakMonths);
		console.log(recipient);
		console.log(methods);
		console.log(tags);
	},
};