const axios = require('axios');

module.exports = {
	async function(client, globals, userID, settingsJson, reset = false) {
		const parent = this;

		if (!('settings' in client)) {
			client.settings = [];
		}

		if (reset) {
			client.settings.currency = new Array();
			client.settings.passive = new Array();
			client.settings.commands = new Array();
			for (const i in require.cache) {
				delete require.cache[i];
			}
		}

		// If we have settings, handle them...
		if (Object.keys(settingsJson).length) {

			client.settings.currency = [];
			client.settings.passive = [];
			client.settings.commands = [];

			// Handle currency settings
			if ('currency' in settingsJson) {
				if ('enabled' in settingsJson.currency) {
					// Basic Settings
					client.settings.currency['enabled'] = settingsJson.currency.enabled;
					client.settings.currency['name'] = [];
					client.settings.currency['name']['single'] = settingsJson.currency.name_single;
					client.settings.currency['name']['plural'] = settingsJson.currency.name_plural;
				}
			}
			else {
				client.settings.currency['enabled'] = false;
			}

			if ('passive' in settingsJson) {
				if ('enabled' in settingsJson.passive) {
					client.settings.passive['enabled'] = settingsJson.passive.enabled;
					client.settings.passive['amts'] = [];
					client.settings.passive['amts']['default'] = settingsJson.passive.default;
					client.settings.passive['amts']['subscribers'] = settingsJson.passive.subscribers;
				}
			}
			else {
				client.settings.passive['enabled'] = false;
			}

			if ('commands' in settingsJson) {
				Object.entries(settingsJson.commands).forEach(([key, value]) => {
					client.settings.commands[ key ] = value;
				});
			}
			else {
				client.settings.commands = [];
			}
		}
		// Otherwise, we get them...
		else {
			await axios.get(globals['endpoint'] + 'load/settings/' + userID)
				.then(function(response) {
					if (response.data.status == 'success') {
						const settings = response.data.response;
						const settingsJson = JSON.parse(settings, 'utf-8');

						client.settings.currency = [];
						client.settings.passive = [];
						client.settings.commands = [];

						// Handle currency settings
						if ('currency' in settingsJson) {
							if ('enabled' in settingsJson.currency) {
								// Basic Settings
								client.settings.currency['enabled'] = settingsJson.currency.enabled;
								client.settings.currency['name'] = [];
								client.settings.currency['name']['single'] = settingsJson.currency.name_single;
								client.settings.currency['name']['plural'] = settingsJson.currency.name_plural;
							}
						}
						else {
							client.settings.currency['enabled'] = false;
						}

						if ('passive' in settingsJson) {
							if ('enabled' in settingsJson.passive) {
								client.settings.passive['enabled'] = settingsJson.passive.enabled;
								client.settings.passive['amts'] = [];
								client.settings.passive['amts']['default'] = settingsJson.passive.default;
								client.settings.passive['amts']['subscribers'] = settingsJson.passive.subscribers;
							}
						}
						else {
							client.settings.passive['enabled'] = false;
						}

						if ('commands' in settingsJson) {
							Object.entries(settingsJson.commands).forEach(([key, value]) => {
								client.settings.commands[ key ] = value;
							});
							parent.commandsLoad(client, globals, client.userID);
						}
						else {
							client.settings.commands = [];
						}
					}
				})
				.catch(err => console.log(err))
				.finally(() => {
					return client;
				});
		}

	},
};