require('../../data/globals');

const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { rule_roles } = require(global.configFile); // eslint-disable-line

module.exports = {
	data: new SlashCommandBuilder()
		.setName('accept-rules')
		.setDescription('Command to output rules spiel')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		await interaction.deferReply();

		const rows = [];
		const row = new ActionRowBuilder();
		row.addComponents(
			new ButtonBuilder()
				.setCustomId('ruleRoles_accept')
				.setLabel('I Accept')
				.setStyle(ButtonStyle.Primary),
		);
		rows.push(row);

		// Buttons!
		const message = await interaction.fetchReply();
		interaction.deleteReply();

		const channel = interaction.client.channels.cache.get(message.channelId);
		channel.send({ content: rule_roles.message, components: rows });

	},
};