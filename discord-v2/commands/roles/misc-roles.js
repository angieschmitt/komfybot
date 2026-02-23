const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('misc-roles')
		.setDescription('Command to output role options')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		const { client } = interaction;
		const misc_roles = client.settings.misc_roles;

		await interaction.deferReply();

		const size = Object.keys(misc_roles.buttons).length;
		const runs = Math.ceil(size / 5);

		const rows = [];
		for (let index = 1; index <= runs; index++) {

			let i = 1;
			const row = new ActionRowBuilder();
			for (const [key, data] of Object.entries(misc_roles.buttons)) {
				if (i > (5 * (index - 1)) && i <= (5 * index)) {
					const unique = key.replace('/', '-');
					if (data.icon !== '') {
						row.addComponents(
							new ButtonBuilder()
								.setCustomId('miscRoles_' + unique)
								.setLabel(ucwords(key))
								.setStyle(ButtonStyle.Primary)
								.setEmoji(data.icon),
						);
					}
					else {
						row.addComponents(
							new ButtonBuilder()
								.setCustomId('miscRoles_' + unique)
								.setLabel(ucwords(key))
								.setStyle(ButtonStyle.Primary),
						);
					}
				}
				i++;
			}
			rows.push(row);
		}

		// Buttons!
		const message = await interaction.fetchReply();
		interaction.deleteReply();

		const channel = interaction.client.channels.cache.get(message.channelId);
		channel.send({ content: misc_roles.message, components: rows });

	},
};

function ucwords(str) {
	return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
		return $1.toUpperCase();
	});
}