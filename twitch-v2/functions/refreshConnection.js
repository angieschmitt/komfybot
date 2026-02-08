const axios = require('axios');

module.exports = {
	function(client, globals) {
		// const interval = 10000;
		const interval = 1800000;
		setInterval(() => {
			if (client.readyState() == 'OPEN') {
				axios.get(globals['endpoint'] + 'token/update/' + client.userID)
					.then(function(response) {
						const results = response.data;
						if (results.status == 'success') {
							const resultData = Object.values(results.response)[0];
							const botDataJson = JSON.parse(resultData['botData'], 'utf-8');

							// Update the password
							client.opts.identity.password = botDataJson['botToken'];

							// Update the bot info...
							client['clientID'] = botDataJson['clientID'];
							client['appToken'] = botDataJson['appToken'];
							client['botToken'] = botDataJson['botToken'];
						}
					})
					.catch(err => console.log(err))
					.finally(() => {
						client.connect(true).catch(err => console.log(err));
						// Disconnect, then reconnect
						// client.disconnect()
						// 	.then(() => {
						// 		client.connect(true).catch(err => console.log(err));
						// 		console.log('Connection - Refreshed');
						// 	})
						// 	.catch(err => console.log(err));
					});
			}
		}, interval);
		return client;
	},
};