module.exports = {
	async function(redeems, client, reset = false) {
		const parent = this;

		client.redeems = [];
		client.redeems.states = [];

		if (reset) {
			client.redeems = new Array();
			client.redeems.states = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		const redeemsJson = JSON.parse(redeems);
		Object.entries(redeemsJson).forEach(([index, timer]) => { // eslint-disable-line no-unused-vars
			client.redeems[index] = parent.redeemsHandler(index);
		});
	},
};