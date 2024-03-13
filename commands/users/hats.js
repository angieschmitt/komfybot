require('../../globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hats')
		.setDescription('View the hats you\'ve unlocked for Hattington! ')
		.addBooleanOption(option =>
			option.setName('public')
				.setDescription('Whether or not the response should be public')),
	async execute(interaction) {

		const public = interaction.options.getBoolean('public');

		if (public) {
			await interaction.deferReply();
		}
		else {
			await interaction.deferReply({ ephemeral: true });
		}

		const discord_id = interaction.user.id;

		const url = global.baseUrl + 'interactive/hats/hat_inventory?discord_id=' + encodeURIComponent(discord_id);
		await axios.get(url)
			.then(function(response) {
				const outcome = response.data;

				const hatsList = [];
				// eslint-disable-next-line no-unused-vars
				for (const [id, hatData] of Object.entries(outcome.reference)) {
					hatsList.push({ name: hatData.name, value: hatData.rarity, inline: true });
				}

				const hatsVisual = 'https://www.kittenangie.com/bots/api_new/interactive/hats/hats_visual?discord_id=' + encodeURIComponent(discord_id) + '&rand=' + Math.random();
				const embed = new EmbedBuilder()
					.setTitle('Hats Inventory')
					.setColor(0xC44578)
					// .addFields(hatsList) Too many fields, rewrite then
					.setImage(hatsVisual);

				interaction.editReply({ embeds: [embed] });
			})
			.catch(function(error) {
				interaction.editReply({ content: `Something went wrong? ${error}`, ephemeral: true });
			})
			.finally(function() {
				// always executed
			});
	},
};