require('../../data/globals');

const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { optin_roles } = require(configFile); // eslint-disable-line

module.exports = {
	data: new SlashCommandBuilder()
		.setName('optin-roles')
		.setDescription('Command to output role options')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		await interaction.deferReply();

		const size = Object.keys(optin_roles.buttons).length;
		const runs = Math.ceil(size / 5);

		const rows = [];
		for (let index = 1; index <= runs; index++) {

			let i = 1;
			const row = new ActionRowBuilder();
			for (const [key, data] of Object.entries(optin_roles.buttons)) {
				if (i > (5 * (index - 1)) && i <= (5 * index)) {
					const unique = key.replace('/', '-');
					if (data.icon !== '') {
						row.addComponents(
							new ButtonBuilder()
								.setCustomId('optinRoles_' + unique)
								.setLabel(ucwords(key))
								.setStyle(ButtonStyle.Primary)
								.setEmoji(data.icon),
						);
					}
					else {
						row.addComponents(
							new ButtonBuilder()
								.setCustomId('optinRoles_' + unique)
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
		channel.send({ content: optin_roles.message, components: rows });

	},
};

function ucwords(str) {
	return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
		return $1.toUpperCase();
	});
}