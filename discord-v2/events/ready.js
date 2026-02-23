const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setActivity('activity', { type: ActivityType.Listening });
		client.user.setPresence({
			activities: [ { name: 'Kiwi talk about butts.', type: ActivityType.Listening } ],
			status: 'online',
		});

	},
};