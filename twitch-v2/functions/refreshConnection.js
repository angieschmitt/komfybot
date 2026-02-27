const axios = require('axios');

module.exports = {
	function(client) {
		// const interval = 10000;
		const interval = 1800000;
		setInterval(() => {
			if (client.readyState() == 'OPEN') {

				// Default to not refreshing...
				let refresh = false;

				axios.get(client.endpoint + 'token/retrieve/' + client.userID)
					.then(function(response) {
						const results = response.data;
						if (results.status == 'success') {
							const resultData = Object.values(results.response)[0];
							const botDataJson = JSON.parse(resultData['botData'], 'utf-8');

							if (client.opts.identity.password !== botDataJson['botToken']) {
								// Update the password
								client.opts.identity.password = botDataJson['botToken'];
								client['botToken'] = botDataJson['botToken'];

								// The password changed, need to refresh...
								refresh = true;
							}

							// Always keep this up to date...
							client['clientID'] = botDataJson['clientID'];
							client['appToken'] = botDataJson['appToken'];
						}
					})
					.catch((err) => {
						client.debug.write(client.channel, 'REFRESH_CONNECTION', err.message);
					})
					.finally(() => {
						if (refresh) {
							// Disconnect, then reconnect
							client.disconnect()
								.then(() => {
									client.connect(true).catch(err => console.log(err));
									console.log(client.channel + ' : Connection refreshed');
								})
								.catch(err => console.log(err));
						}

					});
			}
		}, interval);
		return client;
	},
};