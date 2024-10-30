// const fs = require('node:fs');
// const path = require('node:path');

module.exports = {
	eventHandler(channel, tags, message) {

		const client = this;

		if (tags['room-id'] === tags['source-room-id']) {

			const bitText = (parseInt(tags['bits']) > 1 ? 'bits' : 'bit');

			client.say(channel, `Thanks for the ${tags['bits']} ${bitText} ${tags['username']}!`);

			console.log('caught cheer');
			console.log(channel);
			console.log(tags);
			console.log(message);
		}
	},
};