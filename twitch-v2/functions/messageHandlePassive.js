const axios = require('axios');

module.exports = {
	function(client, channel, message, tags, perms) {

		let income = client.settings.passive.amts.default;
		if (perms.sub) {
			income = client.settings.passive.amts.subscribers;
		}

		const viewerID = tags['user-id'];

		// Now smash that endpoint...
		axios.get(client.endpoint + 'coins/passive/' + client.userID + '/' + viewerID + '/' + income)
			.catch(err => console.log(err));

		// console.log('handling message');
		// console.log(client.opts.identity);
		// console.log(channel);
		// console.log(tags);
		// console.log(message);
	},
};