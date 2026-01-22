module.exports = {
	async function(globals) {
		const parent = this;

		const channels = await parent.retrieveBotUsers(globals);
		Object.entries(channels).forEach(async ([uuid, results]) => { // eslint-disable-line no-unused-vars
			parent.createBot(globals, uuid);
		});

		return globals;
	},
};