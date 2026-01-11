const axios = require('axios');

module.exports = {
	async function(client, globals, userID) {

		client.commands = [];
		client.commands['global'] = [];
		client.commands['user'] = [];

		await axios.get(globals['endpoint'] + 'commands/retrieve/' + userID)
			.then(function(response) {
				if (response.data.status == 'success') {
					const commands = response.data.response;
					Object.entries(commands).forEach(([index, command]) => { // eslint-disable-line no-unused-vars
						Object.entries(command).forEach(([name, data]) => {

							if (name in client.commands['global']) {
							// 	if (!(channel in client.commands['global'][name]['actions'])) {
							// 		client.commands['global'][name]['actions'][channel] = [];
							// 		client.commands['global'][name]['actions'][channel] = data[channel];
							// 	}
							}
							else if (!(name in client.commands['user'])) {
								client.commands['user'][name] = [];
								client.commands['user'][name]['name'] = name;
								client.commands['user'][name]['actions'] = [];
								client.commands['user'][name]['actions']['default'] = data;
							}

							// Handle Aliases
							if ('aliases' in data) {
								Object.entries(data['aliases']).forEach(([alias]) => {
									client.commands['user'][alias] = [];
									client.commands['user'][alias]['alias'] = name;
									client.commands['user'][alias]['arg'] = false;
									client.commands['user'][alias]['list'] = false;
								});
							}
						});
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				return client;
			});
	},
};