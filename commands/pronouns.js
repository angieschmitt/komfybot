const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { pronouns } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pronouns')
		.setDescription('Command to output pronoun options')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		let i = 1;
		const row = new ActionRowBuilder();
		for (const [key, data] of Object.entries(pronouns.buttons)) {
			if (i <= 5) {
				const unique = key.replace('/', '-');
				if (data.icon !== '') {
					row.addComponents(
						new ButtonBuilder()
							.setCustomId('pronouns_' + unique)
							.setLabel(key)
							.setStyle(ButtonStyle.Primary)
							.setEmoji(data.icon),
					);
				}
				else {
					row.addComponents(
						new ButtonBuilder()
							.setCustomId('pronouns_' + unique)
							.setLabel(key)
							.setStyle(ButtonStyle.Primary),
					);
				}
			}
			i++;
		}

		i = 1;
		const row2 = new ActionRowBuilder();
		for (const [key, data] of Object.entries(pronouns.buttons)) {
			if (i > 5 && i <= 10) {
				const unique = key.replace('/', '-');
				if (data.icon !== '') {
					row2.addComponents(
						new ButtonBuilder()
							.setCustomId('pronouns_' + unique)
							.setLabel(key)
							.setStyle(ButtonStyle.Primary)
							.setEmoji(data.icon),
					);
				}
				else {
					row2.addComponents(
						new ButtonBuilder()
							.setCustomId('pronouns_' + unique)
							.setLabel(key)
							.setStyle(ButtonStyle.Primary),
					);
				}
			}
			i++;
		}

		// Buttons!
		interaction.reply({ content: pronouns.message, components: [row, row2] });
		// 	.then(
		// 		(message) => {
		// 			for (const [key] of Object.entries(roles)) {
		// 				message.react(key);
		// 			}
		// 		},
		// 	)
		// 	.catch(console.error);
	},
};