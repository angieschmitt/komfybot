// const axios = require('axios');

module.exports = {
	async function(settings, client, reset = false) {
		// const parent = this;

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

		const settingsJson = JSON.parse(settings, 'utf-8');
		if (Object.keys(settingsJson).length) {

			client.settings.currency = [];
			client.settings.passive = [];
			client.settings.commands = [];
			client.settings.slots = [];

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

			if ('slots' in settingsJson) {
				Object.entries(settingsJson.slots).forEach(([key, value]) => {
					client.settings.slots[ key ] = value;
				});
			}
			else {
				client.settings.slots = [];
			}
		}

		return client;

	},
};