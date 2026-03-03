const axios = require('axios');

const functionsFile = require('../functions/index');
const functions = functionsFile.content();

module.exports = {
	eventHandler(channel, username, viewers, tags) {
		const client = this;

		if (client.events['raided']) {

			module.exports.getLastPlayed(client, username).then((data) => {
				let content = client.events['raided'];
				content = content.replace('{@user}', '@' + username);
				content = content.replace('{@viewers}', viewers + (viewers > 1 ? ' viewers' : ' viewer'));
				content = content.replace('{@lastplayed}', data.lastplayed);

				functions.sayHandler(client, content);
			});

		}

		console.log('caught raid');
		console.log(channel);
		console.log(username);
		console.log(viewers);
		console.log(tags);
	},
	async getLastPlayed(client, username) {
		const reponse = await axios.get(client.endpoint + 'shoutout/insert/' + username);
		const reponse2 = await axios.get(client.endpoint + 'shoutout/retrieve/' + username);

		const raidInfo = [];
		raidInfo['lastplayed'] = reponse2.data.response;
		raidInfo['recent'] = reponse.data.response;

		return raidInfo;
	},
};