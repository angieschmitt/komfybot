const axios = require('axios');

module.exports = {
	async function(client) {
		try {
			const response = await axios.get(client.endpoint + 'discord/token/' + client.userID);
			const data = response.data;

			if (data) {
				client.clientID = data.response.clientID;
				client.guildID = data.response.guildID;
				client.token = data.response.token;
			}

			return client;
		}
		catch (error) {
			// console.log(error);
		}
	},
};