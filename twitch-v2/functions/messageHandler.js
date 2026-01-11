module.exports = {
	function(client, channel, tags, message, self) {
		console.log('handling message');
		console.log(client.opts.identity);
		console.log(channel);
		console.log(tags);
		console.log(message);
		console.log(self);
	},
};