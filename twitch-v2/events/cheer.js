const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(channel, tags, message) {
		const client = this;

		if (client.events['cheer']) {

			let content = client.events['cheer'];
			content = content.replace('{@user}', '@' + tags['display-name']);
			content = content.replace('{@amount}', tags['bits'] + (tags['bits'] > 1 ? ' bits' : ' bit'));

			functions.sayHandler(client, content);
		}

		console.log('caught cheer');
		console.log(channel);
		console.log(tags);
		console.log(message);
	},
};