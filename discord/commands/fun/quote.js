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

		await axios.get(urls.endpoint + 'data/quote/2')
			.then(function(response) {

				const output = response.data;

				if (output.status === 'success') {
					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('Kiwi Quotes')
						.setThumbnail('https://kittenangie.com/bots/images/komfy-kiwi.jpg')
						.addFields(
							{ name: output.response.twitchUsername + ' once said...', value: output.response.content },
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