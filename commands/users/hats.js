require('../../globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hats')
		.setDescription('View the hats you\'ve unlocked for Hattington!'),
	async execute(interaction) {

		await interaction.deferReply();

		const discord_id = interaction.user.id;

		const url = global.baseUrl + 'retrieve/hat_inventory?discord_id=' + encodeURIComponent(discord_id);
		await axios.get(url)
			.then(function(response) {
				const outcome = response.data;

				const hatsList = [];
				for (const [id, hatData] of Object.entries(outcome.content)) {
					hatsList.push({ name: hatData.name, value: hatData.rarity, inline: true });
				}

				const hatsVisual = 'https://www.kittenangie.com/bots/api_new/interactive/hats_visual?hats=' + encodeURIComponent(JSON.stringify(outcome.content)) + '&rand=' + Math.random();
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