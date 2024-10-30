// const fs = require('node:fs');
// const path = require('node:path');

module.exports = {
	eventHandler(channel, tags, message) {

		const client = this;

		if ('source-room-id' in tags) {
			if (tags['room-id'] === tags['source-room-id']) {
				console.log('caught ' + channel + ' cheer');
				const bitText = (parseInt(tags['bits']) > 1 ? 'bits' : 'bit');
				client.say(channel, `Thanks for the ${tags['bits']} ${bitText} ${tags['username']}!`);
			}
			else {
				console.log('caught co-streamer cheer');
			}
		}
		else {
			console.log('caught ' + channel + ' cheer');
			const bitText = (parseInt(tags['bits']) > 1 ? 'bits' : 'bit');
			client.say(channel, `Thanks for the ${tags['bits']} ${bitText} ${tags['username']}!`);
		}

		console.log(channel);
		console.log(tags);
		console.log(message);
	},
};