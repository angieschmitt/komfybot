const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { roles } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role-setup')
		.setDescription('Command to setup role assignments, run in channel with message')
		.addStringOption(option =>
			option
				.setName('message-id')
				.setDescription('Message ID to add roles, must be in this channel')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		await interaction.reply({ content: 'Adding reaction emoji now!', ephemeral: true });

		const messageID = interaction.options.getString('message-id');

		interaction.channel.messages.fetch(messageID)
			.then(
				(message) => {
					for (const [key] of Object.entries(roles)) {
						message.react(key);
					}
				},
			)
			.catch(console.error);
	},
};