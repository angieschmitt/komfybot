require('../globals');

const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { notify_roles } = require(configFile); // eslint-disable-line

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stream-roles')
		.setDescription('Command to output role options')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		const size = Object.keys(notify_roles.buttons).length;
		const runs = Math.ceil(size / 5);

		const rows = [];
		for (let index = 1; index <= runs; index++) {

			let i = 1;
			const row = new ActionRowBuilder();
			for (const [key, data] of Object.entries(notify_roles.buttons)) {
				if (i > (5 * (index - 1)) && i <= (5 * index)) {
					const unique = key.replace('/', '-');
					if (data.icon !== '') {
						row.addComponents(
							new ButtonBuilder()
								.setCustomId('notifyRoles_' + unique)
								.setLabel(ucwords(key))
								.setStyle(ButtonStyle.Primary)
								.setEmoji(data.icon),
						);
					}
					else {
						row.addComponents(
							new ButtonBuilder()
								.setCustomId('notifyRoles_' + unique)
								.setLabel(ucwords(key))
								.setStyle(ButtonStyle.Primary),
						);
					}
				}
				i++;
			}
			rows.push(row);
		}

		await interaction.reply({ content: notify_roles.message, components: rows });

	},
};

function ucwords(str) {
	return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
		return $1.toUpperCase();
	});
}