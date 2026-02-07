require('../data/globals');

const { Events, ActivityType } = require('discord.js');
const { channels, notifications, urls } = require(configFile); // eslint-disable-line

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setActivity('activity', { type: ActivityType.Listening });
		client.user.setPresence({
			activities: [ { name: 'lo-fi beats.', type: ActivityType.Listening } ],
			status: 'idle',
		});

	},
};