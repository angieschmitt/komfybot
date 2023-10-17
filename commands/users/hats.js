require('../../globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hats')
		.setDescription('View the hats you\'ve unlocked for Hattington!')
		.addBooleanOption(option =>
			option
				.setName('public')
				.setDescription('Should this be public or just for you')),
	async execute(interaction) {

		const public = interaction.options.getString('public');

		if (public) {
			await interaction.deferReply();
		}
		else {
			await interaction.deferReply({ ephemeral: true });
		}

		const discord_id = interaction.user.id;

		const url = global.baseUrl + 'retrieve/hat_inventory?discord_id=' + encodeURIComponent(discord_id);
		await axios.get(url)
			.then(function(response) {
				const outcome = response.data;

				const hatsList = [];
				// eslint-disable-next-line no-unused-vars
				for (const [id, hatData] of Object.entries(outcome.content)) {
					hatsList.push({ name: hatData.name, value: hatData.rarity, inline: true });
				}

				const hatsVisual = 'https://www.kittenangie.com/bots/api_new/interactive/hats_visual?discord_id=' + encodeURIComponent(discord_id) + '&rand=' + Math.random();
				const embed = new EmbedBuilder()
					.setTitle('Hats Inventory')
					.setColor(0xC44578)
					.addFields(hatsList)
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