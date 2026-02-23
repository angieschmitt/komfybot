const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(client, reaction, user) {
		// When a reaction is received, check if the structure is partial
		if (reaction.partial) {
			// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
			try {
				await reaction.fetch();
			}
			catch (error) {
				console.error('Something went wrong when fetching the message:', error);
				// Return as `reaction.message.author` may be undefined/null
				return;
			}
		}

		const message	= reaction.message;
		const member	= reaction.message.guild.members.cache.find(m => m.id === user.id);

		if (client.settings.messages.includes(message.id)) {
			const reactedWith = reaction.emoji.name;
			if (reactedWith in client.settings.roles) {
				const role = reaction.message.guild.roles.cache.find(r => r.id === client.settings.roles[reactedWith]);
				member.roles.add(role);
			}
		}
	},
};