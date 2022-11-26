const { Events } = require('discord.js');
const { messages, roles } = require('../config.json');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, user) {
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
		// console.log(member);

		if (messages.includes(message.id)) {
			const reactedWith = reaction.emoji.name;
			// console.log('is message');
			if (reactedWith in roles) {
				const role = reaction.message.guild.roles.cache.find(r => r.id === roles[reactedWith]);
				// console.log('is reaction');
				// console.log(role);
				member.roles.add(role);
			}
		}
	},
};