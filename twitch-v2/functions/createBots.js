module.exports = {
	async function(globals) {
		const parent = this;
		const channels = await parent.retrieveBotUsers(globals);

		const bots = {};
		Object.entries(channels).forEach(async ([uuid, results]) => { // eslint-disable-line no-unused-vars
			bots[ channels[uuid]['userID'] ] = parent.createBot(globals, uuid, channels[uuid]);
		});

		return new Promise((resolve, reject) => {
			resolve(bots);
			reject(false);
		});
	},
};