module.exports = {
	function(client, message) {
		client.say(client.channel, message).catch(() => {
			setTimeout(() => {
				client.say(client.channel, message);
			}, 2500);
		});
	},
};