require('../../data/globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { urls, apiKey } = require(configFile); // eslint-disable-line

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quotes')
		.setDescription('Quotable quotes.'),
	async execute(interaction) {

		await interaction.deferReply();

		await axios.get(urls.finalUrl + 'v1/quote/retrieve/komfykiwi')
			.then(function(response) {

				const output = response.data;

				if (output.status === 'success') {
					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('Kiwi Quotes')
						.setThumbnail('https://kittenangie.com/bots/images/komfy-kiwi.jpg')
						.addFields(
							{ name: output.username + ' once said...', value: output.response },
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