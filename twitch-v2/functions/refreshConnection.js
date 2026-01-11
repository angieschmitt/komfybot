const axios = require('axios');

module.exports = {
	function(clientData, globals, client) {
		// const interval = 5000;
		const interval = 3600000;
		setInterval(() => {
			if (client.readyState() == 'OPEN') {
				const channelName = clientData.channels[0].replace('#', '');
				axios.get(globals['endpoint'] + 'token/update/' + channelName)
					.then(function(response) {
						const results = response.data;
						if (results.status == 'success') {
							const resultData = Object.values(results.response)[0];
							const botDataJson = JSON.parse(resultData['botData'], 'utf-8');
							clientData.identity.password = botDataJson['botToken'];
						}
					})
					.catch(err => console.log(err))
					.finally(() => {
						// Disconnect, then reconnect
						client.disconnect().catch(err => console.log(err));
						setTimeout(() => {
							client.connect(true).catch(err => console.log(err));
							// console.log('Connection - Refreshed');
							// console.log('- - -');
						}, 5000);
					});
			}
		}, interval);
		return client;
	},
};