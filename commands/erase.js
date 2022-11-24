const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('erase')
		.setDescription('Deletes previous messages ?')
		.addStringOption(option =>
			option
				.setName('quantity')
				.setDescription('How many messages to delete'))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		const member = interaction.member;

		if (member.roles.cache.some(role => role.name === 'Moderator')) {

			// Acknowledge
			await interaction.reply({ content: 'Working on it!', ephemeral: true });

			const channel 	= interaction.channel;
			const quantity	= interaction.options.getString('quantity') ?? 1;

			let count = 0;
			channel.messages.fetch({ limit: quantity }).then(messages => {
				// Iterate through the messages here with the variable "messages".
				messages.forEach(message => {
					setTimeout(() => {
						message.delete();
						count++;
						if (count === messages.size) {
							interaction.editReply(`Erased ${count} messages.`);
						}
					}, 1000);
				});
			});

		}
		else {

			await interaction.reply({ content: 'That command is not for you, and has been logged.', ephemeral: true });

		}

	},
};