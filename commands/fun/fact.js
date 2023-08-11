require('../../globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const today = new Date();
const dd 	= String(today.getDate()).padStart(2, '0');
const mm 	= String(today.getMonth() + 1).padStart(2, '0');
const yyyy	= today.getFullYear();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact-of-the-day')
		.setDescription('Fact of the Day, updates daily.'),
	async execute(interaction) {

		await interaction.deferReply();

		await axios.get(global.baseUrl + 'retrieve/fact/')
			.then(function(response) {

				const output = response.data;

				if (output.status === 'success') {
					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('Fact of the Day')
						.setThumbnail('https://kittenangie.com/bots/images/question-mark.png')
						.addFields(
							{ name: `${mm}/${dd}/${yyyy}`, value: output.content },
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