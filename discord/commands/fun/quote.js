require('../../data/globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quotes')
		.setDescription('Quotable quotes.'),
	async execute(interaction) {

		await interaction.deferReply();

		await axios.get(global.baseUrl + '/retrieve/quote/')
			.then(function(response) {

				const output = response.data;

				if (output.status === 'success') {
					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('Kiwi Quotes')
						.setThumbnail('https://kittenangie.com/bots/images/komfy-kiwi.jpg')
						.addFields(
							{ name: 'Kiwi once said...', value: output.content },
						)
						.setTimestamp()
						.setFooter(
							{ text: `ID: ${output.id}` },
						);

					interaction.editReply({ embeds: [embed] });
				}
				else {
					interaction.editReply({ content: 'Something went wrong?' });
				}

			})
			.catch(function(error) {
				interaction.editReply({ content: `Something went wrong? ${error}` });
			})
			.finally(function() {
				// always executed
			});
	},
};