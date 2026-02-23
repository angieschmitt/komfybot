const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Command to output rules')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addBooleanOption(option =>
			option.setName('button')
				.setDescription('Whether or not to output the button')),
	async execute(interaction) {

		const { client } = interaction;
		const rule_roles = client.settings.rule_roles;

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

		const button = (interaction.options.getBoolean('button') ?? false);

		if (button) {
			channel.send({ content: rule_roles.message, components: rows });
		}
		else {
			channel.send({ content: rule_roles.message });
		}

	},
};