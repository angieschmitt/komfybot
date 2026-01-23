module.exports = {
	function(client, channel, message, tags) {

		const userID = tags['user-id'];
		const words = client.reactwords;

		const output = {};
		// Check user specific first
		if (userID in words) {
			Object.entries(words[userID]).forEach(([match, response]) => {
				if (message.includes(match)) {
					output[match] = response.replace('<@username>', '@' + tags.username);
				}
				else if (message.toLowerCase().includes(match)) {
					output[match] = response.replace('<@username>', '@' + tags.username);
				}
			});
		}

		// If no user specific, check globals
		if (0 in words) {
			Object.entries(words[0]).forEach(([match, response]) => {
				if (message.includes(match)) {
					output[match] = response.replace('<@username>', '@' + tags.username);
				}
				else if (message.toLowerCase().includes(match)) {
					output[match] = response.replace('<@username>', '@' + tags.username);
				}
			});
		}

		// If output, return.. if not false
		if (Object.keys(output).length) {
			return output;
		}
		return false;
	},
};